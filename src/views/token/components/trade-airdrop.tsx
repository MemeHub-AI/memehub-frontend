import React, { ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { useAirdrop } from '../hooks/trade-v3/use-airdrop'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Img } from '@/components/img'
import { Countdown } from '@/views/airdrop/components/countdown'
import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'
import { airdropApi } from '@/api/airdrop'
import { useTradeSearchParams } from '../hooks/use-search-params'
import { AirdropItem } from '@/api/airdrop/types'
import { useAirdropInfo } from '@/views/airdrop/hooks/use-airdrop-info'
import { MarketType } from '@/api/token/types'
import { useUserStore } from '@/stores/use-user-store'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { userInfo } = useUserStore()

  const {
    data: { data = [] } = {},
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [airdropApi.getDetails.name, chainName, tokenAddr, userInfo?.id],
    queryFn: () => {
      if (userInfo?.id == null) return Promise.reject()

      return airdropApi.getDetails({
        chain: chainName,
        token_address: tokenAddr,
      })
    },
  })
  const kol = data?.find((a) => a.kol_name)
  const communities = data?.find((a) => a.community_name)
  const isOnlyOne = data?.length === 1

  if (isEmpty(data)) return

  return (
    <div className="mt-2.5 gap-4 border-2 border-black rounded-lg pt-3 pb-2">
      <h2 className="font-bold text-lg ml-3 w-fit">{t('airdrop')}</h2>
      <div className="flex items-center gap-3">
        {kol && (
          <AirdropCard
            className={cn('w-full', isOnlyOne && 'w-1/2')}
            airdrop={kol}
            suffix={t('ambassador')}
            typeList={MarketType.Kol}
            isKol
          />
        )}
        {communities && (
          <AirdropCard
            className={cn('w-full', isOnlyOne && 'w-1/2')}
            airdrop={communities}
            suffix={t('holder')}
            typeList={MarketType.Community}
            isCommunity
          />
        )}
      </div>
    </div>
  )
}

interface AirdropCardProps extends ComponentProps<typeof Card> {
  airdrop: AirdropItem
  suffix: string
  typeList: number
  isKol?: boolean
  isCommunity?: boolean
}

const AirdropCard = (props: AirdropCardProps) => {
  const { className, airdrop, suffix, typeList, isKol, isCommunity } = props
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const [isExpired, setIsExpired] = useState(false)

  const { total, claimed, isClaimed, durationSeconds, refetchIsClaimed } =
    useAirdropInfo(
      isKol ? MarketType.Kol : MarketType.Community,
      airdrop.chain,
      airdrop.distribution_id
    )

  const { isClaiming, claim } = useAirdrop(
    airdrop.distribution_id,
    typeList.toString(),
    refetchIsClaimed
  )

  const disabled = isClaimed || isClaiming || isExpired

  return (
    <Card
      padding="md"
      shadow="none"
      border="none"
      className={cn('cursor-[unset]', className)}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="bg-lime-green flex items-center gap-2 rounded-md pr-2">
          <Img
            src={airdrop.kol_logo || airdrop.community_logo}
            alt="avatar"
            className="w-10 h-10 rounded-r-none"
          />
          <span>
            {airdrop.kol_name || airdrop.community_name} {suffix}
          </span>
          <img src="/images/check.png" alt="check" className="w-6 h-6" />
        </div>
        <Countdown
          createdAt={airdrop.create ?? 0}
          duration={durationSeconds}
          onExpired={() => setIsExpired(true)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/gift.png" alt="Avatar" className="w-7 h-7" />
          <span>
            {BigNumber(airdrop.amount ?? 0).toFormat()} {tokenInfo?.ticker}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TbUsers size={20} />
          {BigNumber(claimed).toFormat()} / {BigNumber(total).toFormat()}
        </div>
      </div>
      <Button
        className={cn('mt-3 w-full', !isClaimed && 'bg-lime-green-deep')}
        disabled={disabled}
        onClick={claim}
      >
        {isClaimed ? t('claimed') : t('airdrop.claim')}
      </Button>
    </Card>
  )
}

export default TradeAirdrop
