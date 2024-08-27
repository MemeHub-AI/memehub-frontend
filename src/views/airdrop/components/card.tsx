import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { Card } from '@/components/ui/card'
import { Countdown } from '@/components/countdown'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { useAirdropInfo } from '../../../hooks/airdrop/use-airdrop-info'
import { fmt } from '@/utils/fmt'
import { useAirdropContext } from '@/contexts/airdrop'
import { utilLang } from '@/utils/lang'
import { IdTag } from '@/components/id-tag'
import { useAirdrop } from '@/views/token/hooks/evm/use-airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { useChainInfo } from '@/hooks/use-chain-info'
import { joinPaths } from '@/utils'
import { Routes } from '@/routes'

interface Props {
  className?: string
  airdrop: AirdropItem | undefined
  detail: AirdropItem['airdrop'][number]
  isKolCard: boolean
}

export const AirdropCard = ({
  className,
  airdrop,
  detail,
  isKolCard,
}: Props) => {
  const {
    image_url,
    symbol,
    chain,
    contract_address = '',
    coin_version,
    airdrop_address,
    airdrop_version,
    bond_version,
    bond_address,
  } = airdrop ?? {}
  const { t } = useTranslation()
  const { query, pathname, ...router } = useRouter()
  const { shouldHideClaimed } = useAirdropContext()
  const { chainId, chainName } = useChainInfo(chain)
  const [isExpired, setIsExpired] = useState(false)

  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore()
  const {
    createAt,
    durationSeconds,
    kolTotalAmount,
    communityTotalAmount,
    kolClaimedCount,
    kolCount,
    communityCount,
    communityClaimedCount,
  } = useAirdropInfo({
    airdropId: detail?.distribution_id,
    chainId,
    airdropVersion: airdrop_version,
    airdropAddr: airdrop_address,
    tokenVersion: coin_version,
    tokenAddr: contract_address,
    bcVersion: bond_version,
    bcAddr: bond_address,
  })

  console.log('airdrop ', airdrop)

  const totalAmount = isKolCard ? kolTotalAmount : communityTotalAmount
  const current = isKolCard ? kolClaimedCount : communityClaimedCount
  const total = isKolCard ? kolCount : communityCount
  const hasAmount = total - current > 0

  const { isKolClaimed, isCommunityClaimed, isBurned } = useAirdrop(
    detail?.distribution_id,
    airdrop_address,
    airdrop_version,
    chainId
  )
  const isClaimed = isKolCard ? isKolClaimed : isCommunityClaimed
  const disabled = isClaimed || isBurned || !hasAmount

  const renderButtonText = () => {
    if (isClaimed) return t('airdrop.claimed')
    if (isBurned) return t('airdrop.burned')
    if (isExpired) return t('goto.burn')
    if (!hasAmount) return t('airdrop.no-amount')

    return t('claim.airdrop')
  }

  if (shouldHideClaimed && isClaimed) return

  return (
    <Card
      className={cn('p-3 max-sm:w-[96vw] max-w-[450px]', className)}
      shadow="none"
      onClick={() =>
        router.push({
          pathname: joinPaths(chainName, contract_address),
          query,
        })
      }
    >
      <div className="flex justify-between">
        <span className="font-bold truncate max-w-[15.25rem]">
          {airdrop?.symbol}({airdrop?.name})
        </span>
        <Countdown
          createdAt={createAt}
          duration={durationSeconds}
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
              {BigNumber(totalAmount ?? 0).toFormat()} {symbol}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={20} />
            <span className="ml-2">
              {BigNumber(current).toFormat()} / {BigNumber(total).toFormat()}
            </span>
          </div>
          <Button className="mt-3 font-bold w-full" disabled={disabled}>
            {renderButtonText()}
          </Button>
        </div>
        <Img src={image_url} className="w-40 h-40 max-sm:!w-[38%] " />
      </div>
    </Card>
  )
}
