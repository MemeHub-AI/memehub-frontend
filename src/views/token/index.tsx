import React from 'react'
import { isAddress } from 'viem'

import { useResponsive } from '@/hooks/use-responsive'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { cn } from '@/lib/utils'
import { TokenDesktop } from './components/desktop'
import { TokenMobile } from './components/mobile'
import { TokenQueryInvalid } from './components/query-invalid'
import { useTradeSearchParams } from './hooks/use-search-params'
import { useChainsStore } from '@/stores/use-chains-store'
import { idoTrumpCard } from '@/config/ido'
import { usePools } from './hooks/use-pools'

export const TokenPage = () => {
  const { chainName, tokenAddr, isReady } = useTradeSearchParams()
  const { chainsMap } = useChainsStore()
  const { isMobile } = useResponsive()
  const tokenInfo = useTokenInfo()
  const { isLoadingTokenInfo } = tokenInfo
  const { isGraduated } = usePools(tokenInfo.tokenInfo?.address)

  const invalidPath = !chainsMap[chainName] || !isAddress(tokenAddr)
  if (invalidPath && !isLoadingTokenInfo && isReady) {
    return <TokenQueryInvalid reason={`/${chainName}/${tokenAddr}`} />
  }

  // TODO: ido temp
  const isIdoToken = tokenAddr === idoTrumpCard.address
  if (isIdoToken) tokenInfo.tokenInfo = idoTrumpCard as any

  return (
    <TokenProvider
      value={{
        ...tokenInfo,
        reserveSymbol: tokenInfo.tokenInfo?.chain.native.symbol,
        isIdoToken,
        isGraduated,
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
    </TokenProvider>
  )
}

export default TokenPage
