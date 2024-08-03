import { BsArrowDownUp } from 'react-icons/bs'
import { BsGraphUpArrow } from 'react-icons/bs'
import { LuUsers } from 'react-icons/lu'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TokenInfoHeader } from './token-info-header'
import { TradeTab } from './trade-tab'
import { TokenInfoCard } from './token-info-card'
import { CommentTradeTab } from './comment-trade-tab'
import { Chart } from '@/components/chart'
import { TradeAirdrop } from './trade-airdrop'
import { HoldersRank } from './holders-rank'
import { useTokenContext } from '@/contexts/token'
import { cn } from '@/lib/utils'

const enum TabName {
  trade = '0',
  chart = '1',
  holder = '2',
}

export const TokenMobile = () => {
  const { t } = useTranslation()
  const { query, replace } = useRouter()
  const { airdrop } = useTokenContext()
  const {
    kol,
    kolAirdrop,
    kolAirdropInfo,
    communities,
    communitiesAirdrop,
    communitiesAirdropInfo,
  } = airdrop
  const tab = (query.tab || TabName.trade) as string

  /** Gets the airdrop creation time */
  const getCreateTime = (createdAt: number, duration: number) => {
    const createTime = dayjs.unix(createdAt).add(duration, 'second')
    return createTime
  }

  /** Determine if the airdrop has expired */
  const isExpired = (createdAt: number, duration: number) => {
    const diff = getCreateTime(createdAt, duration).diff(dayjs(), 'second')
    if (diff < 0) return true
    return false
  }

  /**
   * Determine how many airdrops are available
   * @returns count - How many airdrops can be picked up
   */
  const getCount = () => {
    let count = 0

    const hasKol = kol && !kolAirdropInfo.isClaimed && !kolAirdrop.isBurn
    if (hasKol && !isExpired(kol.create ?? 0, kolAirdropInfo.durationSeconds)) {
      count++
    }

    const hasCommunity =
      communities &&
      !communitiesAirdropInfo.isClaimed &&
      !communitiesAirdrop.isBurn
    if (
      hasCommunity &&
      !isExpired(
        communities.create ?? 0,
        communitiesAirdropInfo.durationSeconds
      )
    ) {
      count++
    }
    return count
  }

  const tipsCount = getCount()

  return (
    <Tabs
      defaultValue={tab}
      className="w-full min-h-max flex flex-col justify-between"
      onValueChange={(tab) => {
        replace({
          pathname: `/${query.chain}/${query.address}`,
          query: { tab },
        })
      }}
    >
      <TabsContent value={TabName.trade}>
        <TokenInfoHeader />
        <TradeTab className="mt-3" />
        <div className="pt-2"></div>
        <TokenInfoCard />
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
        <div className="fixed left-0 bottom-0 w-full">
          <TabsList className="h-11 grid w-full rounded-none grid-cols-3 bg-white">
            <TabsTrigger value={TabName.trade} className="bg-white">
              <BsArrowDownUp className="mr-1" size={16}></BsArrowDownUp>
              {t('trade.tab')}
            </TabsTrigger>
            <TabsTrigger
              className="border-x-2 border-black relative bg-white"
              value={TabName.chart}
            >
              <BsGraphUpArrow className="mr-1" size={16}></BsGraphUpArrow>
              {t('chart')}
              {tipsCount && tab !== TabName.chart ? (
                <div
                  className={cn(
                    'absolute top-2 right-4 bg-red-500 rounded-full',
                    'w-4 h-4 flex items-center justify-center !text-[10px] text-white'
                  )}
                >
                  <div className="animate-ping bg-red-500 w-4 h-4 rounded-full absolute"></div>
                  {tipsCount}
                </div>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={TabName.holder} className="bg-white">
              <LuUsers className="mr-1" size={20}></LuUsers>
              {t('holder')}
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}
