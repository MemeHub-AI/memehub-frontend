import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { formatEther } from 'viem'

import { Card } from '@/components/ui/card'
import { Countdown } from '@/components/countdown'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { fmt } from '@/utils/fmt'
import { useAirdropContext } from '@/contexts/airdrop'
import { utilLang } from '@/utils/lang'
import { IdTag } from '@/components/id-tag'
import { useUserStore } from '@/stores/use-user-store'
import { joinPaths } from '@/utils'
import { Routes } from '@/routes'
import { DistributionItem } from '../hooks/use-airdrop-list'
import { BI_ZERO } from '@/constants/number'

interface Props {
  className?: string
  isKolCard: boolean
  airdrop: AirdropItem | undefined
  distribution: DistributionItem | undefined
}

export const AirdropCard = ({
  className,
  isKolCard,
  airdrop,
  distribution,
}: Props) => {
  const { t } = useTranslation()
  const { query, pathname, ...router } = useRouter()
  const { shouldHideClaimed } = useAirdropContext()
  const [isExpired, setIsExpired] = useState(false)
  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore()

  const {
    startTime = BI_ZERO,
    duration = BI_ZERO,
    amountPerClaimKOL = BI_ZERO,
    amountPerClaimCommunity = BI_ZERO,
    claimedCountKOL = 0,
    claimedCountCommunity = 0,
    walletCountKOL = 0,
    walletCountCommunity = 0,
    isClaimedKOL = false,
    isClaimedCommunity = false,
    isBurn: isBurned = false,
  } = distribution ?? {}
  const perAmount = formatEther(
    isKolCard ? amountPerClaimKOL : amountPerClaimCommunity
  )
  const currentCount = isKolCard ? claimedCountKOL : claimedCountCommunity
  const totalCount = isKolCard ? walletCountKOL : walletCountCommunity
  const isClaimed = isKolCard ? isClaimedKOL : isClaimedCommunity
  const isClaimedAll = totalCount - currentCount > 0
  const isNoCount = totalCount <= 0
  const disabled = isClaimed || isBurned || isClaimedAll || isNoCount

  const renderButtonText = () => {
    if (isNoCount) return t('airdrop.invalid')
    if (isClaimed) return t('airdrop.claimed')
    if (isBurned) return t('airdrop.burned')
    if (isExpired) return t('goto.burn')
    if (isClaimedAll) return t('airdrop.no-amount')

    return t('claim.airdrop')
  }

  if (shouldHideClaimed && isClaimed) return

  return (
    <Card
      className={cn('p-3 max-sm:w-[96vw] max-w-[450px]', className)}
      shadow="none"
      onClick={() => {
        if (!airdrop?.chain || !airdrop?.contract_address) return
        router.push({
          pathname: joinPaths(airdrop?.chain, airdrop?.contract_address),
          query,
        })
      }}
    >
      <div className="flex justify-between">
        <span className="font-bold truncate max-w-[15.25rem]">
          {airdrop?.symbol}({airdrop?.name})
        </span>
        <Countdown
          createdAt={Number(startTime)}
          duration={Number(duration)}
          onExpired={setIsExpired}
          className="whitespace-nowrap"
        />
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div className="flex-1">
          {(isKolCard && !isKol) || (!isKolCard && !hasCommunity) ? (
            <p className="text-zinc-500 font-semibold leading-10">
              {utilLang.replace(t('airdrop.not-nft2'), [
                // isKol ? 'KOL' : t('pure.community'),
                'KOL', // TODO: temp fixed
              ])}
            </p>
          ) : (
            <IdTag
              src={isKolCard ? kolInfo?.logo : communityInfo?.logo}
              title={
                isKolCard
                  ? kolInfo?.name
                  : fmt.withCommunity(utilLang.locale(communityInfo?.name))
              }
              onClick={(e) => {
                if (!isKolCard || !kolInfo?.wallet_address) return
                e.stopPropagation()
                router.push(joinPaths(Routes.Account, kolInfo.wallet_address))
              }}
            />
          )}
          <div className="mt-3 flex items-center">
            <img src="/images/gift.png" alt="gift" className="w-6 h-6" />
            <span className="ml-2 text-gray-500 break-all line-clamp-1">
              {BigNumber(BigNumber(perAmount).toFixed(0)).toFormat()}{' '}
              {airdrop?.symbol}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={20} />
            <span className="ml-2">
              {BigNumber(currentCount).toFormat()} /{' '}
              {BigNumber(totalCount).toFormat()}
            </span>
          </div>
          <Button className="mt-3 font-bold w-full" disabled={disabled}>
            {renderButtonText()}
          </Button>
        </div>
        <Img src={airdrop?.image_url} className="w-40 h-40 max-sm:!w-[38%] " />
      </div>
    </Card>
  )
}
