import { LaunchProveModal, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
// import { AppContext } from "./_app";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {Menu, X} from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { open } = useWeb3Modal();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
            ZKLend
          </span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
            Markets
          </Link>
          <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
            Lend
          </Link>
          <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
            Borrow
          </Link>
          <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
            Docs
          </Link>
        </nav>
        <div className="hidden md:block">
        <button
                className="bg-[#009A08] rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
                onClick={() => open()}
              >
                CONNECT WALLET
              </button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col gap-4 pb-6">
            <Link
              href="#"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Markets
            </Link>
            <Link
              href="#"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Lend
            </Link>
            <Link
              href="#"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Borrow
            </Link>
            <Link
              href="#"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Docs
            </Link>
            <div className="pt-2">
              <InteractiveHoverButton
                className="bg-purple-800 rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
                onClick={() => open()}
              >
                CONNECT WALLET
              </InteractiveHoverButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

