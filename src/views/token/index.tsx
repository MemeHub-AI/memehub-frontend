import React from 'react'
import { useTranslation } from 'react-i18next'

import { useResponsive } from '@/hooks/use-responsive'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { cn } from '@/lib/utils'
import { TokenDesktop } from './desktop'
import { TokenMobile } from './mobile'

export const TokenPage = () => {
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const {
    tokenInfo,
    isLoadingTokenInfo,
    isFetchingTokenInfo,
    refetchInfo,
    airdrop,
  } = useTokenInfo()

  return (
    <TokenProvider
      value={{
        tokenInfo,
        isLoadingTokenInfo,
        isFetchingTokenInfo,
        refetchInfo,
        airdrop,
      }}
    >
      <main
        className={cn(
          'px-4 max-sm:px-3 pt-6 max-w-main mx-auto min-h-main',
          'flex space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:pt-2 pb-4 max-sm:min-h-max'
        )}
      >
        {/* Left */}
        {isMobile ? <TokenMobile /> : <TokenDesktop />}
      </main>
    </TokenProvider>
  )
}

export default TokenPage
