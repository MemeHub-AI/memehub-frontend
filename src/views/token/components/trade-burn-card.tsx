import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useTradeAirdropContext } from '@/contexts/trade-airdrop'
import { useTokenContext } from '@/contexts/token'
import { useBurnAirdrop } from '../hooks/evm/use-burn-airdrop'

export const TradeBurnCard = ({ className }: ComponentProps<typeof Card>) => {
  const { t } = useTranslation()
  const { tokenInfo, tokenMetadata } = useTokenContext()
  const { airdrop = [] } = tokenInfo ?? {}
  const {
    isOnlyOne,
    totalAirdrop,
    kolClaimedAmount,
    communityClaimedAmount,
    refetchAirdrop,
  } = useTradeAirdropContext()
  const remaining = BigNumber(totalAirdrop)
    .minus(kolClaimedAmount)
    .minus(communityClaimedAmount)
    .toFormat()

  const { isBurned, isBurning, burn } = useBurnAirdrop(
    airdrop[0]?.distribution_id || 0,
    refetchAirdrop
  )

  const burnText = `${remaining} ${tokenInfo?.symbol ?? tokenMetadata?.symbol}`

  return (
    <Card
      hover="none"
      shadow="none"
      border="none"
      className={cn(
        'mt-2.5 w-1/2 gap-4 rounded-lg pt-3 pb-2 relative px-3',
        'max-sm:mt-0 max-sm:w-full',
        isOnlyOne && 'mt-2 pt-2',
        className
      )}
    >
      {!isOnlyOne && (
        <h2 className="font-bold text-lg w-fit">🔥 {t('burn')}</h2>
      )}
      <div className="flex items-center">
        <div className="ml-1 mr-3 max-sm:pb-2">
          {t('airdrop.burn-desc').replace('$1', burnText)}
        </div>
        <img src="/images/burn.png" alt="burn" className="w-28 h-28 -mt-6" />
      </div>
      <Button
        className="w-full mt-3 bg-lime-green-deep"
        disabled={isBurned || isBurning}
        onClick={burn}
      >
        🔥{' '}
        {isBurned
          ? t('airdrop.burned')
          : isBurning
          ? t('burning')
          : t('burn.button').replace('$1', burnText)}
      </Button>
    </Card>
  )
}

export default TradeBurnCard
