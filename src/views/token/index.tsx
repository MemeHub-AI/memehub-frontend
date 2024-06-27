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
import { TradeAirdrop } from './components/trade-airdrop'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'

export const TokenPage = () => {
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const { tokenInfo, isLoadingTokenInfo, isFetchingTokenInfo, refetchInfo } =
    useTokenInfo()

  return (
    <TokenProvider
      value={{
        tokenInfo,
        isLoadingTokenInfo,
        isFetchingTokenInfo,
        refetchInfo,
      }}
    >
      <main
        className={cn(
          'px-4 max-sm:px-3 pt-6 max-w-main mx-auto min-h-main',
          'flex space-x-4 max-sm:flex-col max-sm:space-x-0 pb-4'
        )}
      >
        {/* Left */}
        <div className="flex flex-col flex-1">
          {isMobile && <TradeTab />}
          <TokenInfoHeader />
          <Tabs defaultValue="chart">
            <TabsList className="grid w-full grid-cols-2 mt-1">
              <TabsTrigger value="chart">{t('kline')}</TabsTrigger>
              <TabsTrigger value="info">{t('token.info')}</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <Chart />
            </TabsContent>
            <TabsContent value="info">
              <TokenInfo />
            </TabsContent>
          </Tabs>
          <TradeAirdrop />
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
      </main>
    </TokenProvider>
  )
}

export default TokenPage
