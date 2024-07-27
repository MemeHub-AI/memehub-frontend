import React, { ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'
import { TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { Countdown } from '@/components/countdown'
import { IdTag } from '@/components/id-tag'
import { Img } from '@/components/img'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { idoChain, idoTrumpAirdrop } from '@/config/ido'
import { useIdoKolAirdrop } from '../hooks/use-ido-kol-airdrop'
import { useIdoAirdropClaim } from '../hooks/use-ido-claim'
import { useIdoCommunityAirdrop } from '../hooks/use-ido-community-airdrop'
import { useIdoCheck } from '@/views/ido/hooks/use-ido-check'
import { utilLang } from '@/utils/lang'
import { useReadContract } from 'wagmi'
import { idoAirdropAbi } from '@/contract/ido/abi/airdrop'
import { v3Addr } from '@/contract/v3/address'
import { zeroAddress } from 'viem'

interface Props {
  tag: string
  isKolAirdrop?: boolean
}

export const IdoAirdropCard = ({
  className,
  tag,
  isKolAirdrop = false,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const { name, ticker, logo, create } = idoTrumpAirdrop
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
  const { isKol, isCommunity } = useIdoCheck(idoChain.id)

  const amount = isKolAirdrop ? 6666 ?? kolAmount : 3000 ?? communityAmount
  const current = isKolAirdrop ? 0 ?? kolCurrent : 0 ?? communityCurrent
  const total = isKolAirdrop ? 300 ?? kolTotal : 2000 ?? communityTotal
  const isClaimed = isKolAirdrop ? isKolClaimed : isCommunityClaimed
  const hasId = isKolAirdrop ? isKol : isCommunity

  const { data: tokenAddr = zeroAddress } = useReadContract({
    abi: idoAirdropAbi,
    address: v3Addr[idoChain.id]?.idoAirdrop,
    chainId: idoChain.id,
    functionName: 'tokenAddress',
    query: { enabled: !!v3Addr[idoChain.id]?.idoAirdrop },
  })
  const isNotStart = tokenAddr === zeroAddress

  const { isClaming, claim } = useIdoAirdropClaim(() => {
    refetchKolAirdrop()
    refetchCommunityAirdrop()
  })

  // TODO: remove `true`
  const disabled =
    true ||
    isClaming ||
    isClaimed ||
    BigNumber(amount).isZero() ||
    !hasId ||
    (!isKolAirdrop && isBelowThreshold)

  const renderButtonText = () => {
    // TODO: remove
    return t('ido.airdrop.not-start')

    if (isClaming) return t('airdrop.claiming')

    if (isClaimed) return t('airdrop.claimed')

    if (BigNumber(amount).isZero()) return t('ido.airdrop.no-claim')

    if (!hasId) {
      return utilLang.replace(t('ido.airdrop.no-id'), [
        isKolAirdrop ? 'KOL' : t('pure.community'),
      ])
    }
    if (!isKolAirdrop && isBelowThreshold) {
      return `${t('balance-insufficient')} ${communityThreshold} ${
        idoChain.native.symbol
      }`
    }

    return t('pure.claim')
  }

  return (
    <Card hover="none" className={cn('p-3', className)} shadow="none">
      <div className="flex justify-between">
        <span className="font-bold truncate">
          {ticker}({name})
        </span>
        <Countdown createdAt={create ?? 0} duration={10} />
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div className="self-end">
          <div className="bg-lime-green text-sm 2xl:text-base rounded-md px-2 py-0.5 flex items-center max-w-max">
            {tag}
          </div>
          <div className="mt-3 flex items-center">
            <img src="/images/gift.png" alt="gift" className="w-6 h-6" />
            <span className="ml-2 text-gray-500 break-all line-clamp-1">
              {BigNumber(amount).toFormat()} {ticker}
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
            {renderButtonText()}
          </Button>
        </div>
        <Img src={logo} className="w-36 h-36" />
      </div>
    </Card>
  )
}

export default IdoAirdropCard
