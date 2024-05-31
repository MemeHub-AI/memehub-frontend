import React from 'react'

import { TradeTab } from './components/trade-tab'
import { TokenInfo } from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import { useResponsive } from '@/hooks/use-responsive'
import { HoldersRank } from './components/holders-rank'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { CandlestickChart } from '@/components/candlestick-chart'
import { TokenInfoHeader } from './components/token-info-header'
import { BondingCurveProgress } from './components/bonding-curve-progress'

export const TokenPage = () => {
  const { isMobile } = useResponsive()
  const { tokenInfo, totalToken, currentToken, refetchInfo } = useTokenInfo()

  return (
    <TokenProvider value={{ tokenInfo, totalToken, currentToken, refetchInfo }}>
      <main className="px-4 max-sm:px-3 pt-4 max-w-main mx-auto min-h-main">
        {/* Header */}
        <TokenInfoHeader />

        {/* Body */}
        <div className="flex space-x-4 max-sm:flex-col max-sm:space-x-0 mt-4">
          {/* Left */}
          <div className="flex flex-col flex-1">
            {isMobile && <TradeTab />}
            <CandlestickChart />
            <BondingCurveProgress />
            <CommentTradeTab />
          </div>

          {/* Right */}
          {!isMobile && (
            <div className="w-aside">
              <TradeTab />
              <TokenInfo />
              <HoldersRank />
            </div>
          )}
        </div>
      </main>
    </TokenProvider>
  )
}

export default TokenPage
