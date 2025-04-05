import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardSidebar() {
  return (
    <aside className="w-full border-l border-purple-800/30 bg-black/60 p-4 md:w-80 md:min-w-80">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Account 1</h2>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm text-gray-400 hover:text-white">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-2 w-full justify-start border-purple-800/30 bg-black text-sm text-gray-400 hover:bg-purple-900/20 hover:text-white"
      >
        Overview
      </Button>

      <div className="mt-6 text-sm text-gray-400">Get started by depositing assets into your account.</div>

      <Card className="mt-6 border-purple-800/30 bg-black/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            Deposited assets
            <span className="rounded-full bg-purple-900/30 px-2 py-0.5 text-xs text-purple-400">0</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-gray-400">No assets deposited yet</div>
          <Button className="mt-2 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900">
            Deposit
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 border-purple-800/30 bg-black/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            Borrowed assets
            <span className="rounded-full bg-purple-900/30 px-2 py-0.5 text-xs text-purple-400">0</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-gray-400">No assets borrowed yet</div>
          <Button className="mt-2 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900">
            Borrow
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 border-purple-800/30 bg-black/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            Wallet balances
            <span className="rounded-full bg-purple-900/30 px-2 py-0.5 text-xs text-purple-400">0</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-gray-400">Connect your wallet to view balances</div>
        </CardContent>
      </Card>
    </aside>
  )
}

