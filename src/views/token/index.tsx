import React from 'react'

import { TradeTab } from './components/trade-tab'
import { TokenInfo } from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import { useResponsive } from '@/hooks/use-responsive'
import { HoldersRank } from './components/holders-rank'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { Chart } from '@/components/chart'
import { TokenInfoHeader } from './components/token-info-header'
import { cn } from '@/lib/utils'

export const TokenPage = () => {
  const { isMobile } = useResponsive()
  const { tokenInfo, totalToken, currentToken, refetchInfo } = useTokenInfo()

  return (
    <TokenProvider value={{ tokenInfo, totalToken, currentToken, refetchInfo }}>
      <main
        className={cn(
          'px-4 max-sm:px-3 pt-6 max-w-main mx-auto min-h-main',
          'flex space-x-4 max-sm:flex-col max-sm:space-x-0'
        )}
      >
        {/* Left */}
        <div className="flex flex-col flex-1">
          {isMobile && <TradeTab />}
          <TokenInfoHeader className="mb-1" />
          <Chart />
          <CommentTradeTab className="mt-3" />
        </div>

        {/* Right */}
        {!isMobile && (
          <div className="w-aside">
            <TradeTab />
            <TokenInfo />
            <HoldersRank />
          </div>
        )}
      </main>
    </TokenProvider>
  )
}

export default TokenPage
