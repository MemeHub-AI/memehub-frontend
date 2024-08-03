import { useState, type ComponentProps } from 'react'
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
import { type UserInfoRes } from '@/api/user/types'
import { type CommunityListItem } from '@/api/alliance/type'
import { useAirdrop } from '../hooks/trade-v1/use-airdrop'
import { fmt } from '@/utils/fmt'

interface AirdropCardProps extends ComponentProps<typeof Card> {
  suffix: string
  createAt: number
  duration: number
  totalAmount: string | number
  current: string | number
  total: string | number
  kolInfo?: UserInfoRes
  communityInfo?: CommunityListItem
}

export const TradeAirdropCard = ({
  className,
  suffix,
  createAt,
  duration,
  totalAmount,
  current,
  total,
  kolInfo,
  communityInfo,
}: AirdropCardProps) => {
  const { t } = useTranslation()
  const { tokenInfo, tokenMetadata } = useTokenContext()
  const [isExpired, setIsExpired] = useState(false)
  const {
    isKolClaimed,
    isCommunityClaimed,
    isClaiming,
    claimKol,
    claimCommunity,
  } = useAirdrop(
    0 // TODO: should be dynamic
  )
  const isClaimed = kolInfo ? isKolClaimed : isCommunityClaimed
  const disabled = isExpired || isClaimed

  const claim = () => {
    if (kolInfo) {
      claimKol()
      return
    }

    // TODO: nft & token community special id
    claimCommunity()
  }

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
        <Countdown
          createdAt={createAt}
          duration={duration}
          onExpired={() => setIsExpired(true)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/gift.png" alt="Avatar" className="w-7 h-7" />
          <span className="ml-2">
            {BigNumber(totalAmount).toFormat()}{' '}
            {tokenInfo?.ticker || tokenMetadata?.symbol}
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
          {isClaimed
            ? t('already-claimed')
            : isClaiming
            ? t('claiming')
            : t('airdrop.claim')}
        </Button>
      </div>
    </Card>
  )
}

export default TradeAirdropCard
