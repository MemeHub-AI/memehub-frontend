import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useTranslation } from 'react-i18next'

import { useResponsive } from '@/hooks/use-responsive'
import { TokenProvider } from '@/contexts/token'
import { useTokenInfo } from './hooks/use-token-info'
import { cn } from '@/lib/utils'
import { TokenDesktop } from './components/desktop'
import { TokenMobile } from './components/mobile'
import { useTokenQuery } from './hooks/use-token-query'
import { NotFound } from '@/components/not-found'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { TradeAirdropProvider } from '@/contexts/trade-airdrop'
import { Network } from '@/enums/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTokenWs } from './hooks/use-token-ws'

export const TokenPage = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { chainName, tokenAddr, isReady } = useTokenQuery()

  const { tokenInfo, isLoadingTokenInfo, ...otherInfo } = useTokenInfo(
    tokenAddr,
    chainName
  )
  const { chain: tokenChain, chainId } = useChainInfo(chainName)
  const tradeWs = useTokenWs(tokenInfo, otherInfo.isNotFound)
  const airdropInfo = useAirdropInfo(
    tokenInfo?.airdrop?.[0]?.distribution_id,
    tokenAddr,
    chainId,
    tokenInfo?.coin_version
  )
  const { hasKolAirdrop, hasCommunityAirdrop } = airdropInfo
  const reserveSymbol = tokenChain?.native.symbol
  const network = Network.Evm // TODO: should dynamic

  const isOnlyOne = useMemo(() => {
    let count = 0
    if (hasKolAirdrop) count++
    if (hasCommunityAirdrop) count++
    return count === 1
  }, [hasKolAirdrop, hasCommunityAirdrop])

  const invalidPath = !tokenChain || !isAddress(tokenAddr)
  if (invalidPath && !isLoadingTokenInfo && isReady) {
    return (
      <NotFound
        title={t('token.invalid.token')}
        src="/images/empty.png"
        imgClass="max-w-64 max-sm:max-w-1/2"
      />
    )
  }

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
      <TradeAirdropProvider
        value={{
          ...airdropInfo,
          isOnlyOne,
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
