import Image from "next/image"

import { Button } from "@/components/ui/button"

interface AssetRowProps {
  symbol: string
  name: string
  price: number
  deposits: {
    amount: string
    value: string
  }
  borrows: {
    amount: string
    value: string
  }
  ltv: string
  depositApr: string
  borrowApr: string
  highlighted?: boolean
}

export function AssetRow({
  symbol,
  name,
  price,
  deposits,
  borrows,
  ltv,
  depositApr,
  borrowApr,
  highlighted = false,
}: AssetRowProps) {
  return (
    <div className={`grid grid-cols-6 gap-4 p-4 text-sm ${highlighted ? "bg-purple-900/10" : ""}`}>
      <div className="col-span-1 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-purple-900/30">
          <Image
            src={`/placeholder.svg?height=32&width=32&text=${symbol}`}
            alt={symbol}
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>
        <div>
          <div className="font-medium text-white">{symbol}</div>
          <div className="text-xs text-gray-400">${price.toLocaleString()}</div>
        </div>
      </div>
      <div className="col-span-1 flex flex-col justify-center">
        <div className="font-medium text-white">{deposits.amount}</div>
        <div className="text-xs text-gray-400">{deposits.value}</div>
      </div>
      <div className="col-span-1 flex flex-col justify-center">
        <div className="font-medium text-white">{borrows.amount}</div>
        <div className="text-xs text-gray-400">{borrows.value}</div>
      </div>
      <div className="col-span-1 flex items-center text-white">{ltv}</div>
      <div className="col-span-1 flex items-center text-gold-400">{depositApr}</div>
      <div className="col-span-1 flex items-center justify-between">
        <span className="text-purple-400">{borrowApr}</span>
        <div className="flex gap-1">
          <Button size="sm" className="h-7 bg-gold-400 text-xs text-black hover:bg-gold-500">
            Supply
          </Button>
          <Button size="sm" className="h-7 bg-purple-600 text-xs text-white hover:bg-purple-700">
            Borrow
          </Button>
        </div>
      </div>
    </div>
  )
}

