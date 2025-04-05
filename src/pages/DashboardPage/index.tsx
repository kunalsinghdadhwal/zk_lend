"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AssetRow } from "@/components/asset-row"
import { AnnouncementBanner } from "@/components/announcement-banner"

export default function DashboardPage() {
  const [activePool, setActivePool] = useState("main")

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <AnnouncementBanner />
      <DashboardHeader />

      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs defaultValue="main" className="w-full" onValueChange={setActivePool}>
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-black">
                <TabsTrigger
                  value="main"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
                >
                  Main pool <span className="ml-1 text-purple-500">🔥</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stable"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
                >
                  Stable pool <span className="ml-1 text-gold-400">🔥</span>
                </TabsTrigger>
                <TabsTrigger
                  value="high-yield"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
                >
                  High Yield pool
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-purple-800/30 bg-black text-sm text-gray-400 hover:bg-purple-900/20 hover:text-white"
              >
                All pools <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search assets"
                  className="h-8 w-full min-w-[200px] border-purple-800/30 bg-black pl-8 text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-purple-800/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold-400">$230.5M</div>
              </CardContent>
            </Card>
            <Card className="border-purple-800/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total borrows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold-400">$59.7M</div>
              </CardContent>
            </Card>
            <Card className="border-purple-800/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">TVL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold-400">$170.8M</div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border border-purple-800/30 bg-black/60 backdrop-blur-sm">
            <div className="grid grid-cols-6 gap-4 border-b border-purple-800/30 p-4 text-sm font-medium text-gray-400">
              <div className="col-span-1">Asset</div>
              <div className="col-span-1 flex items-center gap-1">
                Deposits <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="col-span-1 flex items-center gap-1">
                Borrows <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="col-span-1 flex items-center gap-1">
                LTV/BW <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="col-span-1 flex items-center gap-1">
                Deposit APR <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="col-span-1 flex items-center gap-1">
                Borrow APR <ArrowUpDown className="h-3 w-3" />
              </div>
            </div>

            <div className="divide-y divide-purple-800/30">
              <AssetRow
                symbol="ETH"
                name="Ethereum"
                price={3217.57}
                deposits={{ amount: "317k", value: "$38.5M" }}
                borrows={{ amount: "169k", value: "$20.6M" }}
                ltv="0.65 / 1"
                depositApr="2.33%"
                borrowApr="5.43%"
              />
              <AssetRow
                symbol="BTC"
                name="Bitcoin"
                price={61010.0}
                deposits={{ amount: "101M", value: "$101M" }}
                borrows={{ amount: "0", value: "$0" }}
                ltv="0.70 / 1"
                depositApr="3.47%"
                borrowApr="7.21%"
              />
              <AssetRow
                symbol="USDC"
                name="USD Coin"
                price={1.0}
                deposits={{ amount: "46.4M", value: "$46.4M" }}
                borrows={{ amount: "27.9M", value: "$27.9M" }}
                ltv="0.70 / 1"
                depositApr="3.47%"
                borrowApr="7.21%"
                highlighted
              />
              <AssetRow
                symbol="USDT"
                name="Tether"
                price={1.0}
                deposits={{ amount: "12.6M", value: "$12.6M" }}
                borrows={{ amount: "7.16M", value: "$7.16M" }}
                ltv="0.70 / 1"
                depositApr="3.16%"
                borrowApr="6.94%"
              />
              <AssetRow
                symbol="DAI"
                name="Dai"
                price={1.0}
                deposits={{ amount: "7.26M", value: "$7.25M" }}
                borrows={{ amount: "3.65M", value: "$3.65M" }}
                ltv="0.70 / 1"
                depositApr="5.34%"
                borrowApr="8.15%"
              />
            </div>
          </div>
        </main>

        <DashboardSidebar />
      </div>
    </div>
  )
}

