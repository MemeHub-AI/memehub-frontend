import React, { ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'
import { TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { zeroAddress } from 'viem'

import { Countdown } from '@/components/countdown'
import { Img } from '@/components/img'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useIdoKolAirdrop } from '../hooks/use-ido-kol-airdrop'
import { useIdoAirdropClaim } from '../hooks/use-ido-claim'
import { useIdoCommunityAirdrop } from '../hooks/use-ido-community-airdrop'
import { useNftCheck } from '@/hooks/use-nft-check'
import { utilLang } from '@/utils/lang'
import { idoAirdropAbi } from '@/contract/abi/ido/airdrop'
import { addrMap } from '@/contract/address'
import { AirdropItem } from '@/api/airdrop/types'
import { useChainsStore } from '@/stores/use-chains-store'

interface Props {
  tag: string
  isKolAirdrop?: boolean
  airdrop: AirdropItem
}

export const IdoAirdropCard = ({
  className,
  tag,
  isKolAirdrop = false,
  airdrop,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const { name, symbol, image_url, created_at, chain } = airdrop
  const { chainsMap } = useChainsStore()
  const chainId = Number(chainsMap[chain]?.id ?? 0)
  const {
    kolBalance,
    kolAmount,
    kolCurrent,
    kolTotal,
    isKolClaimed,
    refetchKolAirdrop,
  } = useIdoKolAirdrop(isKolAirdrop)
  const {
    communityAmount,
    communityCurrent,
    communityTotal,
    isCommunityClaimed,
    communityThreshold,
    isBelowThreshold,
    refetchCommunityAirdrop,
  } = useIdoCommunityAirdrop(!isKolAirdrop)
  const { isKol, hasCommunity } = useNftCheck(chainId)

  const amount = isKolAirdrop ? kolAmount : communityAmount
  const current = isKolAirdrop ? kolCurrent : communityCurrent
  const total = isKolAirdrop ? kolTotal : communityTotal
  const isClaimed = isKolAirdrop ? isKolClaimed : isCommunityClaimed
  const hasId = isKolAirdrop ? isKol : hasCommunity

  const { data: tokenAddr = zeroAddress } = useReadContract({
    abi: idoAirdropAbi,
    address: addrMap[chainId]?.idoAirdrop!,
    chainId: chainId,
    functionName: 'tokenAddress',
    query: { enabled: !!addrMap[chainId]?.idoAirdrop },
  })
  const isNotStart = tokenAddr === zeroAddress

  const { isClaming, claim } = useIdoAirdropClaim(() => {
    refetchKolAirdrop()
    refetchCommunityAirdrop()
  })

  const disabled =
    isClaming ||
    isClaimed ||
    BigNumber(amount).isZero() ||
    !hasId ||
    (!isKolAirdrop && isBelowThreshold)

  const renderHints = () => {
    if (isNotStart) return t('ido.airdrop.not-start')
    if (isClaming) return
    if (isClaimed) return
    if (BigNumber(amount).isZero()) return t('ido.airdrop.no-claim')
    if (!hasId) {
      return utilLang.replace(t('ido.airdrop.no-id'), [
        isKolAirdrop ? 'KOL' : t('pure.community'),
      ])
    }

    if (!isKolAirdrop && isBelowThreshold) {
      return utilLang.replace(t('balance-insufficient'), [
        `${communityThreshold} ${chainsMap[chain]?.native.symbol ?? ''}`,
      ])
    }

    return
  }

  return (
    <Card hover="none" className={cn('p-3', className)} shadow="none">
      <div className="flex justify-between">
        <span className="font-bold truncate">
          {symbol}({name})
        </span>
        <Countdown createdAt={Number(created_at ?? 0)} duration={10} />
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div className="self-end">
          <div className="bg-lime-green text-sm 2xl:text-base rounded-md px-2 py-0.5 flex items-center max-w-max truncate">
            {tag}
          </div>
          <div className="mt-3 flex items-center">
            <img src="/images/gift.png" alt="gift" className="w-6 h-6" />
            <span className="ml-2 text-gray-500 break-all line-clamp-1">
              {BigNumber(amount).toFormat()} {symbol}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={20} />
            <span className="ml-2">
              {BigNumber(current).toFormat()} / {BigNumber(total).toFormat()}
            </span>
          </div>
          <Button
            className="mt-3 font-bold self-end !min-w-24"
            disabled={disabled}
            onClick={() => claim(isKolAirdrop)}
          >
            {isClaming
              ? t('airdrop.claiming')
              : isClaimed
              ? t('airdrop.claimed')
              : t('pure.claim')}
          </Button>
          <p className="text-sm text-zinc-500 mt-1 ml-0.5">{renderHints()}</p>
        </div>
        <Img src={image_url} className="w-28 h-28 xl:w-36 xl:h-36" />
      </div>
    </Card>
  )
}

export default IdoAirdropCard
