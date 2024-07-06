import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import TokenInfoHeader from './components/token-info-header'
import TradeTab from './components/trade-tab'
import TokenInfo from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import Chart from '@/components/chart'
import TradeAirdrop from './components/trade-airdrop'
import HoldersRank from './components/holders-rank'
import { useTokenContext } from '@/contexts/token'

const enum TabName {
  trade = '0',
  chart = '1',
  holder = '2',
}

const tabReg = /tab=([^&#?]+)/

export const TokenMobile = () => {
  const { query, replace } = useRouter()
  const { airdrop } = useTokenContext()

  const tab = location.search.match(tabReg)?.[1] || TabName.trade
  const { t } = useTranslation()

  const getCount = () => {
    return airdrop.kol && airdrop.communities
      ? 2
      : airdrop.kol || airdrop.communities
      ? 1
      : 0
  }

  const tipsCount = getCount()

  return (
    <Tabs
      defaultValue={tab}
      className="w-full min-h-max flex flex-col justify-between"
      onValueChange={(tab) => {
        replace({
          pathname: `/${query.chain}/${query.address}`,
          query: { tab: tab },
        })
      }}
    >
      <TabsContent value={TabName.trade}>
        <TokenInfoHeader />
        <TradeTab className="mt-3" />
        <div className="pt-2"></div>
        <TokenInfo />
        <CommentTradeTab />
      </TabsContent>
      <TabsContent value={TabName.chart}>
        <Chart />
        <TradeAirdrop />
      </TabsContent>
      <TabsContent value={TabName.holder}>
        <TokenInfoHeader />
        <HoldersRank />
      </TabsContent>
      <div className="h-[36px] mb-2">
        <div className="fixed left-0 bottom-2 px-3 w-full ">
          <TabsList className="h-11 grid w-full grid-cols-3 bg-white">
            <TabsTrigger value={TabName.trade}>{t('trade')}</TabsTrigger>
            <TabsTrigger
              className="border-x-2 border-black relative"
              value={TabName.chart}
            >
              {t('chart')}
              {tipsCount && tab !== TabName.chart ? (
                <div
                  className="absolute top-2 right-4 bg-red-500 rounded-full
                    w-[16px] h-[16px] flex items-center justify-center !text-[10px] text-white
                  "
                >
                  <div className="animate-ping bg-red-500 w-[16px] h-[16px] rounded-full absolute"></div>
                  {tipsCount}
                </div>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={TabName.holder}>{t('holder')}</TabsTrigger>
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}
