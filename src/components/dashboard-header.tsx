"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
// import { ConnectWalletButton } from "@/components/connect-wallet-button"

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-purple-800/30 bg-black/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              ZKLend
            </span>
          </Link>

          <nav className="ml-8 hidden md:flex md:items-center md:gap-1">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-900/20"
            >
              Dashboard
            </Link>
            <Link
              href="/pools"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Pools
            </Link>
            <Link
              href="/rewards"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Rewards
            </Link>
            <Link
              href="/save"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              SAVE
            </Link>
            <Button variant="link" asChild className="h-auto gap-1 p-2 text-sm text-gray-400 hover:text-white">
              <Link href="/docs" target="_blank">
                Docs <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <Button variant="link" asChild className="h-auto gap-1 p-2 text-sm text-gray-400 hover:text-white">
              <Link href="/govern" target="_blank">
                Govern <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            {/* <ConnectWalletButton /> */}
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
      </div>

      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col gap-1 pb-4">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-900/20"
            >
              Dashboard
            </Link>
            <Link
              href="/pools"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Pools
            </Link>
            <Link
              href="/rewards"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Rewards
            </Link>
            <Link
              href="/save"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              SAVE
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Docs <ExternalLink className="ml-1 inline h-3 w-3" />
            </Link>
            <Link
              href="/govern"
              className="rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-purple-900/20 hover:text-white"
            >
              Govern <ExternalLink className="ml-1 inline h-3 w-3" />
            </Link>
            <div className="mt-2 px-2">
              {/* <ConnectWalletButton /> */}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

