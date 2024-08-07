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
import { NotFound } from '@/components/not-found'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'
import { useNftCheck } from '@/hooks/use-nft-check'
import { TradeAirdropProvider } from '@/contexts/trade-airdrop'
import { Network } from '@/enums/contract'
import { TokenType } from '@/enums/token'

export const airdropId = 20 // TODO: temp, should be backend id.

export const TokenPage = () => {
  const { t } = useTranslation()
  const { chainName, tokenAddr, isReady } = useTradeSearchParams()
  const { chainsMap } = useChainsStore()
  const { isMobile } = useResponsive()
  const { tokenInfo, isLoadingTokenInfo, ...oterInfo } = useTokenInfo()

  const tokenChain = chainsMap[chainName]
  const chainId = +(tokenChain?.id ?? 0)
  const reserveSymbol = tokenChain?.native.symbol

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

  const invalidPath = !chainsMap[chainName] || !isAddress(tokenAddr)
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
        ...oterInfo,
        tokenInfo,
        isLoadingTokenInfo,
        reserveSymbol,
        isIdoToken: tokenInfo?.coin_type === TokenType.Ido,
        chainName,
        chainId,
        tokenAddr,
        network: Network.Evm,
        tokenChain,
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
