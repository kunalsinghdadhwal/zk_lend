
# ZK Lending Platform with Anon Aadhaar Authentication

This project implements a lending platform that authenticates users with Zero-Knowledge Proofs (ZKP) using Anon Aadhaar, allowing users to verify their identity without revealing personal information.

## Features

- Anonymous authentication using Anon Aadhaar
- Wallet address mapping to ZK proofs 
- Privacy-preserving identity verification
- Decentralized lending functionality

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- pnpm package manager
- MetaMask or compatible Web3 wallet

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd zk_lend
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Download required Anon Aadhaar artifacts

Download the following files from the [Anon Aadhaar documentation](https://documentation.anon-aadhaar.pse.dev/docs/quick-setup) and place them in the `public` folder:

1. [aadhaar-verifier.wasm](https://storage.googleapis.com/anon-aadhaar-public/wasm/aadhaar-verifier.wasm)
2. [circuit_final.zkey](https://storage.googleapis.com/anon-aadhaar-public/zkey/circuit_final.zkey)
3. [vkey.json](https://storage.googleapis.com/anon-aadhaar-public/vkey.json)

```bash
mkdir -p public
cd public
wget https://storage.googleapis.com/anon-aadhaar-public/wasm/aadhaar-verifier.wasm
wget https://storage.googleapis.com/anon-aadhaar-public/zkey/circuit_final.zkey
wget https://storage.googleapis.com/anon-aadhaar-public/vkey.json
cd ..
```

### Step 4: Configure environment variables

Create a `.env.local` file in the project root with the following:

```
NEXT_PUBLIC_PROJECT_ID=<your-walletconnect-project-id>
```

You can get a project ID by registering at [WalletConnect Cloud](https://cloud.walletconnect.com/).

### Step 5: Run the development server

```bash
pnpm dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Authentication**: Users authenticate using Anon Aadhaar to generate a ZKP of their identity
2. **Wallet Connection**: Users connect their crypto wallet via WalletConnect
3. **ZKP Mapping**: The application maps the user's wallet address to their ZKP, allowing for authenticated, private interactions
4. **Lending Interface**: Once authenticated, users can access the lending platform functionality

## Project Structure

- `/src/pages`: Next.js pages including main app entry
- `/src/components`: Reusable UI components
- `/src/hooks`: Custom hooks including ZKP mapping functionality
- `/public`: Static assets and required Anon Aadhaar artifacts

## Technologies Used

- Next.js
- WalletConnect/Wagmi for wallet integration
- Anon Aadhaar for zero-knowledge proofs
- Firebase for secure data storage
- TypeScript for type safety

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

To run it locally you'll need to add some env variables. You can copy the `.env.local.example` to a `.env.local` file.

```bash
NEXT_PUBLIC_ANON_AADHAAR_CONTRACT_ADDRESS=6bE8Cec7a06BA19c39ef328e8c8940cEfeF7E281
NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD=5Bed00294D031F5EE11358dD4eC55452d40F77Af
NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_TEST=4a78D2C4CC758Ae9B441bA18448A902FFA523BD2
# WalletConnect API key
NEXT_PUBLIC_PROJECT_ID=53b1f48ccd106b3ab67a1a106da2aa2f
# RPC URL
NEXT_PUBLIC_RPC_URL=
# Your wallet private key, used only in deployin contracts
PRIVATE_KEY=
NEXT_PUBLIC_MONGODB_URI=
```

### Install

```bash
pnpm install
```

### Start

```bash
pnpm dev
```

### Test

```bash
cd contracts
npx hardhat test
```
