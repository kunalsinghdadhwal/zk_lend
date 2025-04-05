/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRouter } from 'next/navigation'
import { FunctionComponent, useMemo } from "react";
import Image from "next/image";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { icons } from "../styles/illustrations";
import { shortenAddress } from "@/utils";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import Link from "next/link";
export const Header: FunctionComponent = () => {
  const { isConnected, address } = useAccount();
  const blob = new Blob([icons.aalogo], { type: "image/svg+xml" });
  const aaLogo = useMemo(() => URL.createObjectURL(blob), [icons.aalogo]);
  const { open } = useWeb3Modal();

  return (
    <header className="flex flex-row justify-between">
      <div className="flex flex-row items-center mx-5">
        {/* <Image
          priority
          src={aaLogo}
          width={40}
          height={40}
          alt="Follow us on Twitter"
        /> */}
                
          <h6 className="mb-6 bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-2xl">
            ZkLend
          </h6>
      </div>
      <nav className="hidden md:flex md:items-center md:gap-6">
          <Link href="/DashboardPage" className="text-sm text-gray-400 transition-colors hover:text-white">
            Markets
          </Link>
          <Link href="/DashboardPage" className="text-sm text-gray-400 transition-colors hover:text-white">
            Lend
          </Link>
          <Link href="/DashboardPage" className="text-sm text-gray-400 transition-colors hover:text-white">
            Borrow
          </Link>
          <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
            Docs
          </Link>
        </nav>
      <div className="flex flex-row gap-3 items-center justify-end">
        <div className="flex m-5 items-center space-x-2">
          {isConnected ? (
            <button
              className="bg-purple-800 rounded-lg text-white px-6 py-1 border-2 font-rajdhani font-medium"
              onClick={() => open()}
            >
              {address && shortenAddress(address)}
            </button>
          ) : (
            <InteractiveHoverButton
              className="bg-purple-800 rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
              onClick={() => open()}
            >
              CONNECT WALLET
            </InteractiveHoverButton>
          )}
          {/* {isConnected && <Web3NetworkSwitch />} */}
        </div>
      </div>
    </header>
  );
};
