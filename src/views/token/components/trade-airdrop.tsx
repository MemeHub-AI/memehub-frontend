import React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'

import { TradeAirdropCard } from './trade-airdrop-card'
import { useTradeAirdropContext } from '@/contexts/trade-airdrop'
import { TradeBurnCard } from './trade-burn-card'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const {
    isOnlyOne,
    hasKolAirdrop,
    hasCommunityAirdrop,
    createAt,
    durationSeconds,
  } = useTradeAirdropContext()
  const [countdown] = useCountDown({
    targetDate: dayjs.unix(createAt).add(durationSeconds, 'second'),
  })
  const isAirdropExpired = countdown <= 0

  if (!hasKolAirdrop && !hasCommunityAirdrop) return

  return (
    <div className="flex max-sm:flex-col max-sm:gap-0">
      <div className="mt-2.5 border-2 border-black rounded-lg pt-4 pb-3 max-sm:pt-2 flex-1">
        <div className="flex-1 flex items-center font-bold text-lg">
          <h2 className="flex-1 ml-4 max-sm:ml-3">{t('airdrop')}</h2>
          {isOnlyOne && isAirdropExpired && (
            <h2 className="flex-1">🔥 {t('airdrop.burn')}</h2>
          )}
        </div>
        <div className="flex items-center flex-wrap max-sm:flex-col max-sm:space-y-3">
          {hasKolAirdrop && (
            <TradeAirdropCard type="kol" className="w-1/2 max-sm:w-full" />
          )}
          {hasCommunityAirdrop && (
            <TradeAirdropCard
              type="community"
              className="w-1/2 max-sm:w-full"
            />
          )}
          {isAirdropExpired && (hasKolAirdrop || hasCommunityAirdrop) && (
            <TradeBurnCard />
          )}
        </div>
      </div>
    </div>
  )
}

export default TradeAirdrop
