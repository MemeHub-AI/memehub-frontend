import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'

import { cn } from '@/lib/utils'
import { useTokenContext } from '@/contexts/token'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { useResponsive } from '@/hooks/use-responsive'
import { TradeAirdropCard } from './trade-airdrop-card'
import { useNftCheck } from '@/hooks/use-nft-check'
import { TradeAirdropProvider } from '@/contexts/trade-airdrop'
import { TradeBurnCard } from './trade-burn-card'

export const airdropId = 16 // TODO: temp, should be backend id.

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { tokenAddr, chainId } = useTokenContext()
  const airdropInfo = useAirdropInfo(airdropId, tokenAddr, chainId)
  const nftCheckInfo = useNftCheck(chainId)
  const { hasKolAirdrop, hasCommunityAirdrop, createAt, durationSeconds } =
    airdropInfo
  const [countdown] = useCountDown({
    targetDate: dayjs.unix(createAt).add(durationSeconds, 'second'),
  })
  const isExpired = countdown <= 0

  const isOnlyOne = useMemo(() => {
    let count = 0
    if (hasKolAirdrop) count++
    if (hasCommunityAirdrop) count++
    return count === 1
  }, [hasKolAirdrop, hasCommunityAirdrop])

  if (!hasKolAirdrop && !hasCommunityAirdrop) return

  return (
    <TradeAirdropProvider
      value={{
        ...nftCheckInfo,
        ...airdropInfo,
        isOnlyOne,
      }}
    >
      <div className="flex max-sm:flex-col max-sm:gap-0">
        <div
          className={cn(
            'mt-2.5 border-2 border-black rounded-lg pt-4 pb-3 max-sm:pt-2 flex-1'
            // isOnlyOne && 'flex max-sm:flex-col'
          )}
        >
          <div className="flex-1 flex items-center font-bold text-lg">
            <h2 className="flex-1 ml-4 max-sm:ml-3">{t('airdrop')}</h2>
            {isOnlyOne && <h2 className="flex-1">🔥 {t('airdrop.burn')}</h2>}
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
            {isExpired && (hasKolAirdrop || hasCommunityAirdrop) && (
              <TradeBurnCard />
            )}
          </div>
          {/* {(isOnlyOne || (kol && communities)) && !isMobile ? (
            <BurnCard
              airdrop={kol! || communities!}
              suffix={t('ambassador')}
              className={cn(
                'border-none w-[50%]  max-sm:w-full mt-0',
                isOnlyOne && !isMobile && 'pt-0',
                isOnlyOne && 'w-full',
                !isOnlyOne && 'px-1',
                isOnlyOne ? 'flex-1' : 'mt-2'
              )}
            />
          ) : null} */}
        </div>
        {/* {(!kol && !communities) || isMobile ? (
        <BurnCard
          airdrop={kol! || communities!}
          suffix={t('ambassador')}
          className="flex-1 p-1 pt-2 max-sm:pb-3 max-sm:mt-2.5"
        />
      ) : null} */}
      </div>
    </TradeAirdropProvider>
  )
}

export default TradeAirdrop
