import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'react-use'
import dayjs from 'dayjs'

import { useAirdrop } from '../hooks/trade-v1/use-airdrop'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'
import { AirdropItem } from '@/api/airdrop/types'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { MarketType } from '@/api/token/types'
import { useResponsive } from '@/hooks/use-responsive'
import { TradeAirdropCard } from './airdrop-card'
import { useNftCheck } from '@/hooks/use-nft-check'
import { useUserInfo } from '@/hooks/use-user-info'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { tokenAddr, chainId } = useTokenContext()
  const {
    createAt,
    durationSeconds,
    kolTotalAmount,
    communityTotalAmount,
    kolCount,
    kolClaimedCount,
    communityCount,
    communityClaimedCount,
  } = useAirdropInfo(
    0, // TODO: should be dynamic
    tokenAddr,
    chainId
  )
  const { isKol, hasCommunity, community } = useNftCheck(chainId)
  const { userInfo } = useUserInfo()

  if (!isKol && !hasCommunity) return

  return (
    <div className="flex gap-4 max-sm:flex-col max-sm:gap-0">
      <div
        className={cn(
          'mt-2.5 gap-4 border-2 border-black rounded-lg pt-4 pb-3 max-sm:pt-2 flex-1'
          // isOnlyOne && 'flex max-sm:flex-col'
        )}
      >
        <div className="flex-1">
          <h2 className="flex-1 font-bold text-lg ml-4 w-fit max-sm:ml-3">
            {t('airdrop')}
          </h2>
          <div className="flex items-center flex-wrap max-sm:flex-col max-sm:gap-0">
            {isKol && (
              <TradeAirdropCard
                className={cn('w-[50%] max-sm:w-full')}
                kolInfo={userInfo}
                suffix={t('ambassador')}
                createAt={createAt}
                duration={durationSeconds}
                totalAmount={kolTotalAmount}
                total={kolCount}
                current={kolClaimedCount}
              />
            )}
            {hasCommunity && (
              <TradeAirdropCard
                className={cn('w-[50%] max-sm:w-full max-sm:mt-3')}
                communityInfo={community}
                suffix={t('member')}
                createAt={createAt}
                duration={durationSeconds}
                totalAmount={communityTotalAmount}
                total={communityCount}
                current={communityClaimedCount}
              />
            )}
          </div>
        </div>
        {/* {(isOnlyOne || (kol && communities)) && !isMobile ? (
          <BurnCard
            airdrop={kol! || communities!}
            suffix={t('ambassador')}
            className={cn(
              'border-none w-[50%]  max-sm:w-full mt-0',
              isOnlyOne && !isMobile && 'pt-0',
              isOnlyOne && 'w-full',
              !isOnlyOne && 'px-1',
              isOnlyOne ? 'flex-1' : 'mt-2'
            )}
          />
        ) : null} */}
      </div>
      {/* {(!kol && !communities) || isMobile ? (
        <BurnCard
          airdrop={kol! || communities!}
          suffix={t('ambassador')}
          className="flex-1 p-1 pt-2 max-sm:pb-3 max-sm:mt-2.5"
        />
      ) : null} */}
    </div>
  )
}

interface BurnCardProps {
  className?: string
  airdrop: AirdropItem
  suffix: string
}

const BurnCard = (props: BurnCardProps) => {
  const { className, airdrop } = props
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const [isExpired, setIsExpired] = useState(false)

  const {
    durationSeconds,
    totalAirdrop,
    remain: remainKol,
    refetch,
    refetchIsClaimed,
  } = useAirdropInfo(MarketType.Kol, airdrop.chain, airdrop.distribution_id)
  const { remain: remainCommunity } = useAirdropInfo(
    MarketType.Community,
    airdrop.chain,
    airdrop.distribution_id
  )

  const remain = Math.abs(totalAirdrop - remainKol - remainCommunity)
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

export default TradeAirdrop
