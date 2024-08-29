import { useMemo, useState, type ComponentProps } from 'react'
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
import { getEvmAirdropId } from '@/utils/contract'

interface Props extends ComponentProps<typeof Card> {
  type: 'kol' | 'community'
}

export const TradeAirdropCard = ({ className, type }: Props) => {
  const { t } = useTranslation()
  const [isExpired, setIsExpired] = useState(false)
  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore() // KOL is userself
  const { tokenInfo, tokenMetadata, chainId } = useTokenContext()
  const { airdrop, airdrop_address, airdrop_version } = tokenInfo ?? {}
  const [isKolCard, isCommunityCard] = useMemo(
    () => [type === 'kol', type === 'community'],
    [type]
  )

  const {
    createAt,
    durationSeconds,
    perKolAmount,
    perCommunityAmount,
    claimedCountKOL,
    claimedCountCommunity,
    walletCountKOL,
    walletCountCommunity,
    isClaimedKOL,
    isClaimedCommunity,
    refetchInfo,
  } = useTradeAirdropContext()
  const { isClaiming, claimKol, claimCommunity } = useAirdrop(
    getEvmAirdropId(airdrop),
    chainId,
    airdrop_version,
    airdrop_address,
    refetchInfo
  )

  const suffix = isKolCard ? t('ambassador') : t('pure.community')
  const perAmount = isKolCard ? perKolAmount : perCommunityAmount
  const currentCount = isKolCard ? claimedCountKOL : claimedCountCommunity
  const totalCount = isKolCard ? walletCountKOL : walletCountCommunity
  const isClaimedAll = totalCount - currentCount <= 0

  const isNoNft = (isKolCard && !isKol) || (isCommunityCard && !hasCommunity)
  const isClaimed = isKolCard ? isClaimedKOL : isClaimedCommunity
  const disabled =
    isExpired || isClaimed || isNoNft || isClaiming || isClaimedAll

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
      <div className="bg-lime-green flex items-center rounded-md pr-2">
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
    if (isClaimedAll) return t('airdrop.no-amount')

    return t('airdrop.claim')
  }

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
          <span className="ml-2 truncate max-w-40 xl:max-w-72">
            {BigNumber(BigNumber(perAmount).toFixed(0)).toFormat()}{' '}
            {tokenInfo?.symbol ?? tokenMetadata?.symbol}
          </span>
        </div>

        <div className="flex items-center shrink-0">
          <TbUsers size={20} />
          <span className="ml-2">
            {BigNumber(currentCount).toFormat()} /{' '}
            {BigNumber(totalCount).toFormat()}
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
