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

  const amount = isKolAirdrop ? kolAmount : communityAmount
  const current = isKolAirdrop ? kolCurrent : communityCurrent
  const total = isKolAirdrop ? kolTotal : communityTotal
  const isClaimed = isKolAirdrop ? isKolClaimed : isCommunityClaimed
  const hasId = isKolAirdrop ? isKol : isCommunity

  const { isClaming, claim } = useIdoAirdropClaim(() => {
    refetchKolAirdrop()
    refetchCommunityAirdrop()
  })
  const disabled =
    isClaming ||
    isClaimed ||
    BigNumber(amount).isZero() ||
    !hasId ||
    (isCommunity && isBelowThreshold)

  const buttonText = () => {
    if (isClaming) return t('airdrop.claiming')

    if (isClaimed) return t('airdrop.claimed')

    if (BigNumber(amount).isZero()) return t('ido.airdrop.no-claim')

    if (!hasId) {
      return utilLang.replace(t('ido.airdrop.no-id'), [
        isKolAirdrop ? 'KOL' : t('pure.community'),
      ])
    }

    if (isCommunity && isBelowThreshold) {
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
          <div className="bg-lime-green rounded-md px-2 py-0.5 flex items-center">
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
            className="mt-3 font-bold px-8"
            disabled={disabled}
            onClick={() => claim(isKolAirdrop)}
          >
            {buttonText()}
          </Button>
        </div>
        <Img src={logo} className="w-36 h-36" />
      </div>
    </Card>
  )
}

export default IdoAirdropCard
