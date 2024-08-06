import React, { useMemo } from 'react'
import { isAddress } from 'viem'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'

import { useResponsive } from '@/hooks/use-responsive'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { cn } from '@/lib/utils'
import { TokenDesktop } from './components/desktop'
import { TokenMobile } from './components/mobile'
import { useTradeSearchParams } from './hooks/use-search-params'
import { useChainsStore } from '@/stores/use-chains-store'
import { idoTrumpCard } from '@/config/ido'
import { NotFound } from '@/components/not-found'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { useNftCheck } from '@/hooks/use-nft-check'
import { TradeAirdropProvider } from '@/contexts/trade-airdrop'

export const airdropId = 20 // TODO: temp, should be backend id.

export const TokenPage = () => {
  const { t } = useTranslation()
  const { chainName, tokenAddr, isReady } = useTradeSearchParams()
  const { evmChainsMap } = useChainsStore()
  const { isMobile } = useResponsive()
  const tokenInfo = useTokenInfo()
  const { isLoadingTokenInfo } = tokenInfo
  const chainId = +(evmChainsMap[chainName]?.id ?? 0)
  const reserveSymbol =
    tokenInfo.tokenInfo?.chain.native.symbol ||
    evmChainsMap[chainName]?.native.symbol

  const airdropInfo = useAirdropInfo(airdropId, tokenAddr, chainId)
  const nftCheckInfo = useNftCheck(chainId)
  const { createAt, durationSeconds, hasKolAirdrop, hasCommunityAirdrop } =
    airdropInfo

  const isOnlyOne = useMemo(() => {
    let count = 0
    if (hasKolAirdrop) count++
    if (hasCommunityAirdrop) count++
    return count === 1
  }, [hasKolAirdrop, hasCommunityAirdrop])

  const [countdown] = useCountDown({
    targetDate: dayjs.unix(createAt).add(durationSeconds, 'second'),
  })
  const isAirdropExpired = countdown <= 0

  const invalidPath = !evmChainsMap[chainName] || !isAddress(tokenAddr)
  if (invalidPath && !isLoadingTokenInfo && isReady) {
    return (
      <NotFound
        title={t('token.invalid.token')}
        src="/images/empty.png"
        imgClass="max-w-64 max-sm:max-w-1/2"
      />
    )
  }

  // TODO: ido temp
  const isIdoToken = tokenAddr === idoTrumpCard.address
  if (isIdoToken) tokenInfo.tokenInfo = idoTrumpCard as any

  return (
    <TokenProvider
      value={{
        ...tokenInfo,
        reserveSymbol,
        isIdoToken,
        chainName,
        chainId,
        tokenAddr,
      }}
    >
      <TradeAirdropProvider
        value={{
          ...nftCheckInfo,
          ...airdropInfo,
          isOnlyOne,
          isAirdropExpired,
        }}
      >
        <main
          className={cn(
            'px-4 max-sm:px-3 pt-6 max-w-main mx-auto min-h-main',
            'flex space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:pt-2 pb-4 max-sm:min-h-max'
          )}
        >
          {isMobile ? <TokenMobile /> : <TokenDesktop />}
        </main>
      </TradeAirdropProvider>
    </TokenProvider>
  )
}

export default TokenPage
