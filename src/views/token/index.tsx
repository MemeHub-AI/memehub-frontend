import { type ReactNode } from 'react'

import { useResponsive } from '@/hooks/use-responsive'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { cn } from '@/lib/utils'
import { TokenDesktop } from './components/desktop'
import { TokenMobile } from './components/mobile'
import { useTokenQuery } from './hooks/use-token-query'
import { Network } from '@/enums/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTokenWs } from './hooks/use-token-ws'
import { PrimaryLayout } from '@/components/layouts/primary'
import { PageFallback } from '@/components/page-fallback'

export const TokenPage = () => {
  const { isMobile } = useResponsive()
  const { chainName, tokenAddr } = useTokenQuery()

  const { tokenInfo, isLoadingTokenInfo, ...otherInfo } = useTokenInfo(
    tokenAddr,
    chainName
  )
  const { chain: tokenChain, chainId } = useChainInfo(chainName)
  const tradeWs = useTokenWs(otherInfo.isNotFound)

  const reserveSymbol = tokenChain?.native.symbol
  const network = Network.Evm // TODO: should dynamic

  return (
    <TokenProvider
      value={{
        ...otherInfo,
        tokenInfo,
        isLoadingTokenInfo,
        reserveSymbol,
        tokenAddr,
        chainId,
        chainName,
        tokenChain,
        network,
        ...tradeWs,
      }}
    >
      <main
        className={cn(
          'p-4 max-sm:px-2 max-w-main max-sm:w-screen mx-auto min-h-main ',
          'flex space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:pt-0 pb-4 max-sm:min-h-max'
        )}
      >
        {isMobile ? <TokenMobile /> : <TokenDesktop />}
      </main>
    </TokenProvider>
  )
}

TokenPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout
    disablePadding
    newsAsideClass="!hidden"
    navAsideProps={{ collapseSize: 'isXl2' }}
  >
    <PageFallback>{page}</PageFallback>
  </PrimaryLayout>
)

export default TokenPage
