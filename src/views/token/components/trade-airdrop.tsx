import React, { ComponentProps, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'react-use'
import dayjs from 'dayjs'

import { useAirdrop } from '../hooks/trade-v3/use-airdrop'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Img } from '@/components/img'
import { Countdown } from '@/views/airdrop/components/countdown'
import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'
import { AirdropItem } from '@/api/airdrop/types'
import { useAirdropInfo } from '@/views/airdrop/hooks/use-airdrop-info'
import { MarketType } from '@/api/token/types'
import { useResponsive } from '@/hooks/use-responsive'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { airdrop } = useTokenContext()

  const {
    data,
    communities,
    isOnlyOne,
    kol,
    kolAirdrop,
    kolAirdropInfo,
    communitiesAirdrop,
    communitiesAirdropInfo,
  } = airdrop

  if (isEmpty(data)) return

  return (
    <div className="flex gap-4 max-sm:flex-col max-sm:gap-0">
      <div
        className={cn(
          'mt-2.5 gap-4 border-2 border-black rounded-lg pt-4 pb-3 max-sm:pt-2 flex-1',
          isOnlyOne && 'flex max-sm:flex-col'
        )}
      >
        <div className={isOnlyOne ? 'flex-1' : ''}>
          <h2 className="flex-1 font-bold text-lg ml-4 w-fit max-sm:ml-3">
            {t('airdrop')}
          </h2>
          <div className="flex items-center flex-wrap max-sm:flex-col max-sm:gap-0">
            {kol && (
              <AirdropCard
                className={cn(
                  'w-[50%] max-sm:w-full',
                  !communities ? 'w-full' : ''
                )}
                suffix={t('ambassador')}
                airdrop={kolAirdrop}
                airdropInfo={kolAirdropInfo}
                baseInfo={kol}
              />
            )}
            {communities && (
              <AirdropCard
                className={cn(
                  'w-[50%] max-sm:w-full max-sm:mt-3',
                  !kol ? 'w-full' : '',
                  isOnlyOne && 'max-sm:mt-0'
                )}
                suffix={t('holder')}
                airdrop={communitiesAirdrop}
                airdropInfo={communitiesAirdropInfo}
                baseInfo={communities}
              />
            )}
          </div>
        </div>
        {(isOnlyOne || (kol && communities)) && !isMobile ? (
          <Burn
            kol={kol}
            communities={communities}
            airdrop={kol! || communities!}
            suffix={t('ambassador')}
            className={cn(
              'border-none w-[50%]  max-sm:w-full mt-0',
              isOnlyOne && !isMobile && 'pt-0',
              isOnlyOne && 'w-full',
              !isOnlyOne && 'px-1',
              isOnlyOne ? 'flex-1' : 'mt-2'
            )}
            onburn={() => {}}
          />
        ) : null}
      </div>
      {(!kol && !communities) || isMobile ? (
        <Burn
          kol={kol}
          communities={communities}
          airdrop={kol! || communities!}
          suffix={t('ambassador')}
          className="flex-1 p-1 max-sm:pb-3 max-sm:mt-2.5"
          onburn={() => {}}
        />
      ) : null}
    </div>
  )
}

interface BurmProps {
  className?: string
  burnNumber?: BigNumber
  airdrop: AirdropItem
  suffix: string
  isKol?: boolean
  isCommunity?: boolean
  kol: AirdropItem | undefined
  communities: AirdropItem | undefined
  onburn: () => void
}

const Burn = (props: BurmProps) => {
  const { className, airdrop, kol, communities } = props
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const [isExpired, setIsExpired] = useState(false)

  const {
    durationSeconds,
    remain: remainKol,
    refetch,
    refetchIsClaimed,
  } = useAirdropInfo(MarketType.Kol, airdrop.chain, airdrop.distribution_id)
  const { remain: remainCommunity } = useAirdropInfo(
    MarketType.Community,
    airdrop.chain,
    airdrop.distribution_id
  )

  const remain = Math.min(remainKol, remainCommunity)
  const burnText = `${BigNumber(remain).toFormat()} ${tokenInfo?.ticker}`

  const { isBurning, isBurn, burn } = useAirdrop(
    airdrop.distribution_id,
    MarketType.Kol.toString(),
    () => {
      refetch()
      refetchIsClaimed()
    }
  )

  const countdown = () => {
    if (!airdrop.create || !durationSeconds) {
      return
    }

    const currentTime = dayjs()
    const diff = dayjs
      .unix(airdrop.create)
      .add(durationSeconds, 'second')
      .diff(currentTime, 'second')

    if (diff <= 0) {
      setIsExpired(true)
    } else {
      setIsExpired(false)
    }
  }

  useInterval(countdown, 1000)

  useEffect(() => {
    countdown()
  }, [])

  // if (tokenInfo?.creator.wallet_address !== address) {
  //   return <div className="flex-1"></div>
  // }

  if (!isExpired || isBurn) {
    return <div className="flex-1 max-sm:hidden"></div>
  }

  return (
    <div
      className={cn(
        'mt-2.5 gap-4 border-2 border-black rounded-lg pt-3 pb-2 relative max-sm:mt-0',
        className
      )}
    >
      <div className="px-3 flex flex-col justify-between">
        <div>
          <div className="hidden"></div>

          <h2 className="font-bold text-lg w-fit">{t('burn')}</h2>
          <div className="flex min-h-[106px] items-center">
            <div className="mr-[125px] max-sm:pb-2">
              {t('burn.token,desc').replace('$1', burnText)}
            </div>
            <img
              src="/images/burn.png"
              alt="burn"
              className={cn('w-[120px] h-[120px] ml-2 absolute top-0 right-4')}
            />
          </div>
        </div>
        <Button
          className={cn('w-full', 'bg-lime-green-deep')}
          disabled={isBurning}
          onClick={burn}
        >
          {t('burn.button').replace('$1', burnText)}
        </Button>
      </div>
    </div>
  )
}

interface AirdropCardProps extends ComponentProps<typeof Card> {
  suffix: string
  airdropInfo: ReturnType<typeof useAirdropInfo>
  airdrop: ReturnType<typeof useAirdrop>
  baseInfo: AirdropItem
}

const AirdropCard = (props: AirdropCardProps) => {
  const { className, baseInfo, airdrop, suffix, airdropInfo } = props
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const [isExpired, setIsExpired] = useState(false)
  const { isClaiming, claim } = airdrop
  const { isClaimed, durationSeconds, claimed, total } = airdropInfo

  const disabled = isClaimed || isClaiming || isExpired

  return (
    <Card
      padding="md"
      shadow="none"
      border="none"
      className={cn('cursor-[unset] pb-0', className)}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="bg-lime-green flex items-center  rounded-md pr-2">
          <Img
            src={baseInfo.kol_logo || baseInfo.community_logo}
            alt="avatar"
            className="w-10 h-10 rounded-r-none"
          />
          <span className="ml-2">
            {baseInfo.kol_name || baseInfo.community_name} {suffix}
          </span>
          <img src="/images/check.png" alt="check" className="w-6 h-6 ml-2" />
        </div>
        <Countdown
          createdAt={baseInfo.create ?? 0}
          duration={durationSeconds}
          onExpired={() => setIsExpired(true)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/gift.png" alt="Avatar" className="w-7 h-7" />
          <span className="ml-2">
            {BigNumber(baseInfo.amount ?? 0).toFormat()} {tokenInfo?.ticker}
          </span>
        </div>

        <div className="flex items-center">
          <TbUsers size={20} />
          <span className="ml-2">
            {BigNumber(claimed).toFormat()} / {BigNumber(total).toFormat()}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          className={cn('flex-1 relative', !isClaimed && 'bg-lime-green-deep')}
          disabled={disabled}
          onClick={claim}
        >
          {isClaimed ? t('claimed') : t('airdrop.claim')}
        </Button>
        {/* <Button
          className={cn('flex-1')}
          variant="destructive"
          disabled={isClaimed || isClaiming}
          onClick={burn}
        >
          {t('airdrop.burn')}
        </Button> */}
      </div>
    </Card>
  )
}

export default TradeAirdrop
