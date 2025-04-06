// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ZephyrLending
 * @dev A lending protocol that allows users to supply assets, borrow against collateral, and earn interest
 */
contract ZephyrLending is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Constants
    uint256 public constant BASIS_POINTS = 10000; // 100% in basis points
    uint256 public constant SECONDS_PER_YEAR = 31536000; // 365 days
    
    // Asset struct to track asset parameters
    struct Asset {
        bool isListed;
        uint256 ltv; // Loan-to-Value ratio (in basis points, e.g., 7500 = 75%)
        uint256 liquidationThreshold; // Threshold for liquidation (in basis points)
        uint256 liquidationPenalty; // Penalty for liquidations (in basis points)
        uint256 supplyInterestRate; // Interest rate for lenders (in basis points per year)
        uint256 borrowInterestRate; // Interest rate for borrowers (in basis points per year)
        uint256 totalSupplied; // Total amount supplied
        uint256 totalBorrowed; // Total amount borrowed
        uint256 lastUpdateTimestamp; // Timestamp of last interest accrual
        uint256 reserveFactor; // Percentage of interest that goes to protocol reserves
    }
    
    // User position for an asset
    struct UserPosition {
        uint256 supplied; // Amount supplied by user
        uint256 borrowed; // Amount borrowed by user
        uint256 lastUpdateTimestamp; // Last time the position was updated
    }

    // Liquidation struct to handle stack too deep errors
    struct LiquidationVars {
        uint256 debtAmount;
        uint256 actualDebtAmount;
        uint256 collateralAmount;
        uint256 collateralPrice;
        uint256 debtPrice;
        uint256 penalty;
    }

    // Maps token address to Asset struct
    mapping(address => Asset) public assets;
    // Maps user address to token address to user position
    mapping(address => mapping(address => UserPosition)) public userPositions;
    // Array of supported asset addresses
    address[] public supportedAssets;
    // Protocol reserves
    mapping(address => uint256) public reserves;
    // Paused state
    bool public paused = false;
    // Treasury address for reserve withdrawals
    address public treasuryAddress;
    
    // Events
    event AssetListed(address indexed token, uint256 ltv, uint256 liquidationThreshold);
    event AssetUpdated(address indexed token, uint256 ltv, uint256 liquidationThreshold);
    event Supply(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event Liquidate(
        address indexed liquidator,
        address indexed user,
        address indexed collateralToken,
        address debtToken,
        uint256 collateralAmount,
        uint256 debtAmount
    );
    event ReserveWithdrawn(address indexed token, uint256 amount, address indexed to);
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    
    /**
     * @dev Constructor to initialize the contract with initial parameters
     * @param _treasury Address that will receive protocol fees
     */
    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Treasury cannot be zero address");
        treasuryAddress = _treasury;
    }
    
    // Modifiers
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier assetListed(address token) {
        require(assets[token].isListed, "Asset not listed");
        _;
    }
    
    /**
     * @dev Update treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Treasury cannot be zero address");
        address oldTreasury = treasuryAddress;
        treasuryAddress = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @dev Lists a new asset in the protocol
     * @param token Address of the asset to be listed
     * @param ltv Loan to value ratio in basis points
     * @param liquidationThreshold Liquidation threshold in basis points
     * @param liquidationPenalty Liquidation penalty in basis points
     * @param supplyRate Supply interest rate in basis points per year
     * @param borrowRate Borrow interest rate in basis points per year
     * @param reserveFactor Reserve factor in basis points
     */
    function listAsset(
        address token,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 liquidationPenalty,
        uint256 supplyRate,
        uint256 borrowRate,
        uint256 reserveFactor
    ) external onlyOwner {
        require(!assets[token].isListed, "Asset already listed");
        require(ltv <= liquidationThreshold, "LTV must be <= liquidation threshold");
        require(liquidationThreshold < BASIS_POINTS, "Liquidation threshold must be < 100%");
        require(reserveFactor <= BASIS_POINTS, "Reserve factor must be <= 100%");
        
        assets[token] = Asset({
            isListed: true,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            liquidationPenalty: liquidationPenalty,
            supplyInterestRate: supplyRate,
            borrowInterestRate: borrowRate,
            totalSupplied: 0,
            totalBorrowed: 0,
            lastUpdateTimestamp: block.timestamp,
            reserveFactor: reserveFactor
        });
        
        supportedAssets.push(token);
        emit AssetListed(token, ltv, liquidationThreshold);
    }
    
    /**
     * @dev Updates parameters for a listed asset
     */
    function updateAsset(
        address token,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 liquidationPenalty,
        uint256 supplyRate,
        uint256 borrowRate,
        uint256 reserveFactor
    ) external onlyOwner assetListed(token) {
        require(ltv <= liquidationThreshold, "LTV must be <= liquidation threshold");
        require(liquidationThreshold < BASIS_POINTS, "Liquidation threshold must be < 100%");
        require(reserveFactor <= BASIS_POINTS, "Reserve factor must be <= 100%");
        
        // Update interest before changing rates
        updateInterest(token);
        
        Asset storage asset = assets[token];
        asset.ltv = ltv;
        asset.liquidationThreshold = liquidationThreshold;
        asset.liquidationPenalty = liquidationPenalty;
        asset.supplyInterestRate = supplyRate;
        asset.borrowInterestRate = borrowRate;
        asset.reserveFactor = reserveFactor;
        
        emit AssetUpdated(token, ltv, liquidationThreshold);
    }
    
    /**
     * @dev Updates accrued interest for an asset
     */
    function updateInterest(address token) public assetListed(token) {
        Asset storage asset = assets[token];
        
        if (block.timestamp == asset.lastUpdateTimestamp) return;
        
        uint256 timeElapsed = block.timestamp - asset.lastUpdateTimestamp;
        
        // Calculate interest only if there are borrowers
        if (asset.totalBorrowed > 0) {
            uint256 interestAccrued = asset.totalBorrowed
                .mul(asset.borrowInterestRate)
                .mul(timeElapsed)
                .div(BASIS_POINTS)
                .div(SECONDS_PER_YEAR);
            
            // Add interest to total borrowed
            asset.totalBorrowed = asset.totalBorrowed.add(interestAccrued);
            
            // Calculate protocol fee
            uint256 protocolFee = interestAccrued.mul(asset.reserveFactor).div(BASIS_POINTS);
            reserves[token] = reserves[token].add(protocolFee);
        }
        
        asset.lastUpdateTimestamp = block.timestamp;
    }
    
    /**
     * @dev Supply assets to the protocol
     */
    function supply(address token, uint256 amount) external nonReentrant whenNotPaused assetListed(token) {
        require(amount > 0, "Amount must be greater than 0");
        
        updateInterest(token);
        
        Asset storage asset = assets[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        // Transfer tokens from user to contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user position
        position.supplied = position.supplied.add(amount);
        position.lastUpdateTimestamp = block.timestamp;
        
        // Update asset state
        asset.totalSupplied = asset.totalSupplied.add(amount);
        
        emit Supply(msg.sender, token, amount);
    }
    
    /**
     * @dev Withdraw supplied assets from the protocol
     */
    function withdraw(address token, uint256 amount) external nonReentrant whenNotPaused assetListed(token) {
        require(amount > 0, "Amount must be greater than 0");
        
        updateInterest(token);
        
        UserPosition storage position = userPositions[msg.sender][token];
        require(position.supplied >= amount, "Insufficient balance");
        
        // Check if withdrawal would make account unhealthy
        require(
            _getHealthFactor(msg.sender, token, amount, 0) >= BASIS_POINTS,
            "Withdrawal would make position unhealthy"
        );
        
        // Update user position
        position.supplied = position.supplied.sub(amount);
        
        // Update asset state
        assets[token].totalSupplied = assets[token].totalSupplied.sub(amount);
        
        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @dev Borrow assets from the protocol
     */
    function borrow(address token, uint256 amount) external nonReentrant whenNotPaused assetListed(token) {
        require(amount > 0, "Amount must be greater than 0");
        
        Asset storage asset = assets[token];
        require(asset.totalSupplied.sub(asset.totalBorrowed) >= amount, "Insufficient liquidity");
        
        updateInterest(token);
        
        UserPosition storage position = userPositions[msg.sender][token];
        
        // Check if borrow would make account unhealthy
        require(
            _getHealthFactor(msg.sender, token, 0, amount) >= BASIS_POINTS,
            "Borrow would make position unhealthy"
        );
        
        // Update user position
        position.borrowed = position.borrowed.add(amount);
        position.lastUpdateTimestamp = block.timestamp;
        
        // Update asset state
        asset.totalBorrowed = asset.totalBorrowed.add(amount);
        
        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Borrow(msg.sender, token, amount);
    }
    
    /**
     * @dev Repay borrowed assets to the protocol
     */
    function repay(address token, uint256 amount) external nonReentrant whenNotPaused assetListed(token) {
        require(amount > 0, "Amount must be greater than 0");
        
        updateInterest(token);
        
        UserPosition storage position = userPositions[msg.sender][token];
        require(position.borrowed > 0, "No debt to repay");
        
        // Calculate actual repay amount (cap at current debt)
        uint256 repayAmount = amount > position.borrowed ? position.borrowed : amount;
        
        // Transfer tokens from user to contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), repayAmount);
        
        // Update user position
        position.borrowed = position.borrowed.sub(repayAmount);
        
        // Update asset state
        assets[token].totalBorrowed = assets[token].totalBorrowed.sub(repayAmount);
        
        emit Repay(msg.sender, token, repayAmount);
    }
    
    /**
     * @dev Calculate liquidation parameters to avoid stack too deep errors
     */
    function _calculateLiquidationParams(
        address user,
        address debtToken,
        address collateralToken,
        uint256 debtAmount
    ) internal view returns (LiquidationVars memory vars) {
        UserPosition storage userDebtPosition = userPositions[user][debtToken];
        
        // Cap debt amount to user's debt
        vars.actualDebtAmount = debtAmount > userDebtPosition.borrowed ? userDebtPosition.borrowed : debtAmount;
        
        // Simplified price feed, in practice use an oracle
        vars.collateralPrice = 1e18;
        vars.debtPrice = 1e18;
        vars.penalty = assets[collateralToken].liquidationPenalty;
        
        // Calculate collateral to seize (with liquidation penalty)
        vars.collateralAmount = vars.actualDebtAmount
            .mul(vars.debtPrice)
            .mul(BASIS_POINTS + vars.penalty)
            .div(vars.collateralPrice)
            .div(BASIS_POINTS);
        
        return vars;
    }
    
    /**
     * @dev Perform liquidation operation to avoid stack too deep errors
     */
    function _executeLiquidation(
        address user,
        address liquidator,
        address debtToken,
        address collateralToken,
        LiquidationVars memory vars
    ) internal {
        UserPosition storage userDebtPosition = userPositions[user][debtToken];
        UserPosition storage userCollateralPosition = userPositions[user][collateralToken];
        
        // Cap collateral amount to user's collateral
        vars.collateralAmount = vars.collateralAmount > userCollateralPosition.supplied
            ? userCollateralPosition.supplied
            : vars.collateralAmount;
        
        // Update debt position
        userDebtPosition.borrowed = userDebtPosition.borrowed.sub(vars.actualDebtAmount);
        assets[debtToken].totalBorrowed = assets[debtToken].totalBorrowed.sub(vars.actualDebtAmount);
        
        // Update collateral position
        userCollateralPosition.supplied = userCollateralPosition.supplied.sub(vars.collateralAmount);
        assets[collateralToken].totalSupplied = assets[collateralToken].totalSupplied.sub(vars.collateralAmount);
        
        // Transfer seized collateral to liquidator
        IERC20(collateralToken).safeTransfer(liquidator, vars.collateralAmount);
        
        emit Liquidate(liquidator, user, collateralToken, debtToken, vars.collateralAmount, vars.actualDebtAmount);
    }
    
    /**
     * @dev Liquidate an unhealthy position
     */
    function liquidate(
        address user,
        address debtToken,
        address collateralToken,
        uint256 debtAmount
    ) external nonReentrant whenNotPaused assetListed(debtToken) assetListed(collateralToken) {
        require(user != msg.sender, "Cannot liquidate own position");
        require(debtAmount > 0, "Debt amount must be greater than 0");
        
        // Update interest for both tokens
        updateInterest(debtToken);
        updateInterest(collateralToken);
        
        UserPosition storage userDebtPosition = userPositions[user][debtToken];
        UserPosition storage userCollateralPosition = userPositions[user][collateralToken];
        
        require(userDebtPosition.borrowed > 0, "User has no debt for this asset");
        require(userCollateralPosition.supplied > 0, "User has no collateral for this asset");
        
        // Check if the position is unhealthy
        require(_getUserHealthFactor(user) < BASIS_POINTS, "Position is healthy");
        
        // Calculate liquidation parameters
        LiquidationVars memory vars = _calculateLiquidationParams(user, debtToken, collateralToken, debtAmount);
        
        // Transfer debt tokens from liquidator to contract
        IERC20(debtToken).safeTransferFrom(msg.sender, address(this), vars.actualDebtAmount);
        
        // Execute liquidation
        _executeLiquidation(user, msg.sender, debtToken, collateralToken, vars);
    }
    
    /**
     * @dev Helper function to calculate health factor for asset changes
     */
    function _assetHealthImpact(
        address user, 
        address assetAddress,
        address modifiedToken,
        uint256 withdrawAmount,
        uint256 borrowAmount
    ) internal view returns (uint256 collateralValue, uint256 borrowValue) {
        Asset storage asset = assets[assetAddress];
        UserPosition storage position = userPositions[user][assetAddress];
        
        uint256 supplied = position.supplied;
        uint256 borrowed = position.borrowed;
        
        // Apply hypothetical changes if this is the token being modified
        if (assetAddress == modifiedToken) {
            supplied = supplied > withdrawAmount ? supplied - withdrawAmount : 0;
            borrowed = borrowed + borrowAmount;
        }
        
        // Use 1e18 as a simplified price, in practice use an oracle
        uint256 assetPrice = 1e18;
        
        // Collateral value uses liquidation threshold
        collateralValue = supplied.mul(assetPrice).mul(asset.liquidationThreshold).div(BASIS_POINTS);
        
        // Borrow value is just the borrowed amount * price
        borrowValue = borrowed.mul(assetPrice);
        
        return (collateralValue, borrowValue);
    }
    
    /**
     * @dev Calculate health factor for a position after hypothetical changes
     * Refactored to avoid stack too deep errors
     */
    function _getHealthFactor(
        address user,
        address token,
        uint256 withdrawAmount,
        uint256 borrowAmount
    ) internal view returns (uint256) {
        // Calculate total collateral value and total borrow value across all assets
        uint256 totalCollateralValue = 0;
        uint256 totalBorrowValue = 0;
        
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address assetAddress = supportedAssets[i];
            (uint256 collateralValue, uint256 borrowValue) = _assetHealthImpact(
                user, 
                assetAddress,
                token,
                withdrawAmount,
                borrowAmount
            );
            
            totalCollateralValue = totalCollateralValue.add(collateralValue);
            totalBorrowValue = totalBorrowValue.add(borrowValue);
        }
        
        // If no debt, health factor is maximum
        if (totalBorrowValue == 0) return type(uint256).max;
        
        // Health factor = collateral value / borrow value * 100%
        return totalCollateralValue.mul(BASIS_POINTS).div(totalBorrowValue);
    }
    
    /**
     * @dev Calculate health factor for a user
     */
    function _getUserHealthFactor(address user) internal view returns (uint256) {
        return _getHealthFactor(user, address(0), 0, 0);
    }
    
    /**
     * @dev Get user health factor (public view function)
     */
    function getUserHealthFactor(address user) external view returns (uint256) {
        return _getUserHealthFactor(user);
    }
    
    /**
     * @dev Withdraw protocol reserves
     */
    function withdrawReserves(address token, uint256 amount, address to) external onlyOwner {
        require(reserves[token] >= amount, "Insufficient reserves");
        
        reserves[token] = reserves[token].sub(amount);
        IERC20(token).safeTransfer(to, amount);
        
        emit ReserveWithdrawn(token, amount, to);
    }
    
    /**
     * @dev Pause contract functions
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }
    
    /**
     * @dev Unpause contract functions
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    /**
     * @dev Get total number of supported assets
     */
    function getSupportedAssetsCount() external view returns (uint256) {
        return supportedAssets.length;
    }
    
    /**
     * @dev Get user position
     */
    function getUserPosition(address user, address token) external view returns (uint256 supplied, uint256 borrowed) {
        UserPosition storage position = userPositions[user][token];
        return (position.supplied, position.borrowed);
    }
    
    /**
     * @dev Get asset data
     */
    function getAssetData(address token) external view returns (
        bool isListed,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 totalSupplied,
        uint256 totalBorrowed,
        uint256 supplyInterestRate,
        uint256 borrowInterestRate
    ) {
        Asset storage asset = assets[token];
        return (
            asset.isListed,
            asset.ltv,
            asset.liquidationThreshold,
            asset.totalSupplied,
            asset.totalBorrowed,
            asset.supplyInterestRate,
            asset.borrowInterestRate
        );
    }
}
