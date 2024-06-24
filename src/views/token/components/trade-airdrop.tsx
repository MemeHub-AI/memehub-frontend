import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'

import { useAirdrop } from '../hooks/trade-v2/use-airdrop'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Img } from '@/components/img'
import { Countdown } from '@/views/airdrop/components/countdown'
import { utilTime } from '@/utils/time'
import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const hasKol = true
  const hasCommunities = true
  const isOnlyOne = (hasKol && !hasCommunities) || (!hasKol && hasCommunities)

  return (
    <div className="mt-2.5 gap-4 border-2 border-black rounded-lg pt-3 pb-2">
      <h2 className="font-bold text-lg ml-3 w-fit">{t('airdrop')}</h2>

      <div className="flex items-center gap-3">
        {hasKol && (
          <AirdropCard className={cn('w-full', isOnlyOne && 'w-1/2')} />
        )}
        {hasCommunities && (
          <AirdropCard className={cn('w-full', isOnlyOne && 'w-1/2')} />
        )}
      </div>
    </div>
  )
}

interface AirdropCardProps extends ComponentProps<typeof Card> {}

const AirdropCard = ({ className }: AirdropCardProps) => {
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const { canClaim } = useAirdrop()

  return (
    <Card
      padding="md"
      shadow="none"
      border="none"
      className={cn('cursor-[unset]', className)}
    >
      <div className="flex items-center gap-24 justify-between">
        <div className="bg-lime-green flex items-center gap-2 rounded-md">
          <Img className="w-8 h-8" alt="avatar" />
          <span>KOL Ambassador</span>
          <img src="/images/check.png" alt="check" className="w-6 h-6" />
        </div>
        {utilTime.isPast(0) ? (
          t('expired')
        ) : (
          <Countdown targetTimestamp={0 * 1000} />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/gift.png" alt="Avatar" className="w-7 h-7" />
          <span>90000 {tokenInfo?.ticker}</span>
        </div>

        <div className="flex items-center gap-2">
          <TbUsers size={20} />
          10/20
        </div>
      </div>
      <Button
        className={cn('mt-3 w-full', canClaim && 'bg-lime-green-deep')}
        disabled={!canClaim}
      >
        {t('claim')}
      </Button>
    </Card>
  )
}

export default TradeAirdrop
