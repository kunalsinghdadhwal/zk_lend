"use client"

import { X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-purple-900 via-black to-purple-900 py-2 text-center text-sm text-white">
      <div className="container">
        SAVE is here. Convert your SLND and claim your SEND airdrop.{" "}
        <Button variant="link" className="h-auto p-0 text-sm font-medium text-gold-400 underline">
          Learn more
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-white/70 hover:bg-purple-800/20 hover:text-white"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

