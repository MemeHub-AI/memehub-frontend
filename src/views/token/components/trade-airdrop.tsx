import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'

import { TradeAirdropCard } from './trade-airdrop-card'
import { TradeAirdropProvider } from '@/contexts/trade-airdrop'
import { TradeBurnCard } from './trade-burn-card'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { useTokenContext } from '@/contexts/token'
import { getEvmAirdropId } from '@/utils/contract'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const { tokenInfo, chainId } = useTokenContext()
  const { airdrop, airdrop_version, airdrop_address } = tokenInfo ?? {}
  const airdropInfo = useAirdropInfo(
    getEvmAirdropId(airdrop),
    chainId,
    airdrop_version,
    airdrop_address
  )
  const {
    isOnlyOne,
    hasKolAirdrop,
    hasCommunityAirdrop,
    createAt,
    durationSeconds,
  } = airdropInfo

  const targetDate = useMemo(
    () => dayjs.unix(createAt).add(durationSeconds, 'second'),
    [createAt, durationSeconds]
  )
  const [countdown] = useCountDown({ targetDate })
  const isAirdropExpired = countdown <= 0

  if (!hasKolAirdrop && !hasCommunityAirdrop) return

  return (
    <TradeAirdropProvider value={airdropInfo}>
      <div className="flex max-sm:flex-col max-sm:gap-0">
        <div className="mt-2.5 border-2 border-black rounded-lg pt-4 pb-3 max-sm:pt-2 flex-1">
          <div className="flex-1 flex items-center font-bold text-lg">
            <h2 className="flex-1 ml-4 max-sm:ml-3">{t('airdrop')}</h2>
            {isOnlyOne && isAirdropExpired && (
              <h2 className="flex-1 max-sm:hidden">🔥 {t('airdrop.burn')}</h2>
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
    </TradeAirdropProvider>
  )
}

export default TradeAirdrop
