import { useMemo } from 'react'
import { BsArrowDownUp } from 'react-icons/bs'
import { BsGraphUpArrow } from 'react-icons/bs'
import { LuUsers } from 'react-icons/lu'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TokenInfoHeader } from './token-info-header'
import { TradeTab } from './trade-tabs'
import { TokenInfoCard } from './token-info-card'
import { CommentTradeTab } from './comment-trade-tab'
import { Chart } from '@/components/chart'
import { TradeAirdrop } from './trade-airdrop'
import { HoldersRank } from './holders-rank'
import { cn } from '@/lib/utils'
import { useTradeAirdropContext } from '@/contexts/trade-airdrop'
import { useAirdrop } from '../hooks/evm/use-airdrop'
import { useBurnAirdrop } from '../hooks/evm/use-burn-airdrop'
import { useTokenContext } from '@/contexts/token'
import { useUserStore } from '@/stores/use-user-store'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'

const enum TabName {
  Trade = '0',
  Chart = '1',
  Holder = '2',
}

export const TokenMobile = () => {
  const { t } = useTranslation()
  const { query, replace } = useRouter()
  const tab = (query.tab || TabName.Trade) as string
  const { tokenInfo, chainId } = useTokenContext()
  const { airdrop, airdrop_address, airdrop_version } = tokenInfo ?? {}
  const airdropId = airdrop?.[0]?.distribution_id

  const { createAt, durationSeconds } = useTradeAirdropContext()
  const { isKol, hasCommunity } = useUserStore()
  const { isKolClaimed, isCommunityClaimed } = useAirdrop(
    airdropId,
    airdrop_address,
    airdrop_version,
    chainId
  )
  const { isBurned } = useBurnAirdrop(airdropId)

  const targetDate = useMemo(
    () => dayjs.unix(createAt).add(durationSeconds, 'second'),
    [createAt, durationSeconds]
  )
  const [countdown] = useCountDown({ targetDate })
  const isAirdropExpired = countdown <= 0

  const tipsCount = useMemo(() => {
    if (isAirdropExpired || isBurned) return
    let count = 0

    if (isKol && !isKolClaimed) count++
    if (hasCommunity && !isCommunityClaimed) count++

    return count
  }, [createAt, durationSeconds, isKolClaimed, isCommunityClaimed, isBurned])

  return (
    <Tabs
      defaultValue={tab}
      className="w-full min-h-max flex flex-col justify-between"
      onValueChange={(tab) => {
        replace({
          pathname: fmt.toHref(
            Routes.Main,
            query.chain as string,
            query.address as string
          ),
          query: { tab },
        })
      }}
    >
      <TabsContent value={TabName.Trade}>
        <TokenInfoHeader />
        <TradeTab className="mt-3" />
        <div className="pt-2"></div>
        <TokenInfoCard />
        <CommentTradeTab />
      </TabsContent>
      <TabsContent value={TabName.Chart}>
        <Chart />
        <TradeAirdrop />
      </TabsContent>
      <TabsContent value={TabName.Holder}>
        <TokenInfoHeader />
        <HoldersRank />
      </TabsContent>
      <div className="h-[36px] mb-2">
        <div className="fixed left-0 bottom-0 w-full">
          <TabsList className="h-11 grid w-full rounded-none grid-cols-3 bg-white">
            <TabsTrigger value={TabName.Trade} className="bg-white">
              <BsArrowDownUp className="mr-1" size={16}></BsArrowDownUp>
              {t('trade.tab')}
            </TabsTrigger>
            <TabsTrigger
              className="border-x-2 border-black relative bg-white"
              value={TabName.Chart}
            >
              <BsGraphUpArrow className="mr-1" size={16}></BsGraphUpArrow>
              {t('chart')}
              {!!tipsCount && tab !== TabName.Chart && (
                <div
                  className={cn(
                    'absolute top-2 right-4 bg-red-500 rounded-full',
                    'w-4 h-4 flex items-center justify-center text-xs text-white'
                  )}
                >
                  <div className="animate-ping bg-red-500 w-4 h-4 rounded-full absolute"></div>
                  <span className="scale-75">{tipsCount}</span>
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger value={TabName.Holder} className="bg-white">
              <LuUsers className="mr-1" size={20}></LuUsers>
              {t('holder')}
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}
