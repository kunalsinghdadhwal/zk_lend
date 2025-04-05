import { cn } from "@/lib/utils"
import { NumberTicker } from "./magicui/number-ticker"

interface HeroStatsProps {
  className?: string
}

export function HeroStats({ className }: HeroStatsProps) {
  return (
    <div className={cn("container", className)}>
      <div className="mx-auto max-w-4xl rounded-xl border border-purple-800/30 bg-black/60 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4 md:gap-8 md:p-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 md:text-3xl">$<NumberTicker value={2.4} check = "1" className="text-2xl font-bold text-amber-400 md:text-3xl" />B+</div>
            <div className="mt-1 text-sm text-gray-400">Total Value Locked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 md:text-3xl"><NumberTicker value={120} check="0"/>K+</div>
            <div className="mt-1 text-sm text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 md:text-3xl"><NumberTicker value={5.2} check = "1"/>%</div>
            <div className="mt-1 text-sm text-gray-400">Average APY</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 md:text-3xl">3</div>
            <div className="mt-1 text-sm text-gray-400">Supported Chains</div>
          </div>
        </div>
      </div>
    </div>
  );
}

