import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'

import { Countdown } from '@/components/countdown'
import { Img } from '@/components/img'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTokenContext } from '@/contexts/token'
import { cn } from '@/lib/utils'
import { utilLang } from '@/utils/lang'
import { useAirdrop } from '../hooks/evm/use-airdrop'
import { fmt } from '@/utils/fmt'
import { useTradeAirdropContext } from '@/contexts/trade-airdrop'
import { useUserStore } from '@/stores/use-user-store'

interface Props extends ComponentProps<typeof Card> {
  type: 'kol' | 'community'
}

export const TradeAirdropCard = ({ className, type }: Props) => {
  const { t } = useTranslation()
  const [isExpired, setIsExpired] = useState(false)
  const { tokenInfo, tokenMetadata, chainId } = useTokenContext()
  const {
    airdrop_index = 0,
    airdrop_address,
    airdrop_version,
  } = tokenInfo ?? {}

  const {
    createAt,
    durationSeconds,
    kolTotalAmount,
    kolCount,
    kolClaimedCount,
    communityTotalAmount,
    communityCount,
    communityClaimedCount,
    refetchAirdrop,
  } = useTradeAirdropContext()
  const {
    isKolClaimed,
    isCommunityClaimed,
    isClaiming,
    claimKol,
    claimCommunity,
  } = useAirdrop(
    airdrop_index, // TODO: should be `distributor_id`
    airdrop_address,
    airdrop_version,
    chainId,
    refetchAirdrop
  )
  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore() // KOL is userself
  const [isKolCard, isCommunityCard] = useMemo(
    () => [type === 'kol', type === 'community'],
    [type]
  )
  const suffix = isKolCard ? t('ambassador') : t('pure.community')
  const totalAmount = isKolCard ? kolTotalAmount : communityTotalAmount
  const current = isKolCard ? kolClaimedCount : communityClaimedCount
  const total = isKolCard ? kolCount : communityCount

  const isNoNft = (isKolCard && !isKol) || (isCommunityCard && !hasCommunity)
  const isClaimed = isKolCard ? isKolClaimed : isCommunityClaimed
  const disabled = isExpired || isClaimed || isNoNft || isClaiming

  const claim = () => {
    if (isKolCard) {
      claimKol()
      return
    }

    // TODO: nft & token community special id
    claimCommunity()
  }

  const renderIdTag = () => {
    if (isNoNft) {
      return (
        <p className="text-zinc-500 leading-10">
          {utilLang.replace(t('airdrop.not-kol-nft'), [
            isKolCard ? 'KOL' : t('pure.community'),
          ])}
        </p>
      )
    }

    return (
      <div className="bg-lime-green flex items-center  rounded-md pr-2">
        <Img
          src={kolInfo?.logo ?? communityInfo?.logo}
          alt="avatar"
          className="w-10 h-10 rounded-r-none"
        />
        <span className="ml-2">
          {kolInfo?.name
            ? kolInfo?.name
            : fmt.withCommunity(utilLang.locale(communityInfo?.name))}{' '}
          {suffix}
        </span>
        <img src="/images/check.png" alt="check" className="w-6 h-6 ml-2" />
      </div>
    )
  }

  const renderButtonText = () => {
    if (isClaimed) return t('already-claimed')
    if (isClaiming) return t('claiming')
    if (isNoNft) return t('airdrop.not-nft')
    if (isExpired) return t('expired')

    return t('airdrop.claim')
  }

  useEffect(() => {}, [isClaiming])

  return (
    <Card
      padding="md"
      shadow="none"
      border="none"
      className={cn('cursor-[unset] pb-0', className)}
    >
      <div className="flex items-center gap-2 justify-between">
        {renderIdTag()}
        <Countdown
          createdAt={createAt}
          duration={durationSeconds}
          onExpired={() => setIsExpired(true)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/gift.png" alt="Avatar" className="w-7 h-7" />
          <span className="ml-2">
            {BigNumber(totalAmount).toFormat()}{' '}
            {tokenInfo?.symbol ?? tokenMetadata?.symbol}
          </span>
        </div>

        <div className="flex items-center">
          <TbUsers size={20} />
          <span className="ml-2">
            {BigNumber(current).toFormat()} / {BigNumber(total).toFormat()}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          className="flex-1 relative bg-lime-green-deep disabled:bg-white"
          disabled={disabled}
          onClick={claim}
        >
          {renderButtonText()}
        </Button>
      </div>
    </Card>
  )
}

export default TradeAirdropCard
