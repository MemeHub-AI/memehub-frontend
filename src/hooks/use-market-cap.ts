import { useEffect, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { first } from 'lodash'
import { useInterval } from 'ahooks'
import { formatEther } from 'viem'

import { useTokenContext } from '@/contexts/token'
import { useUniswapV2Amount } from './uniswapv2/use-uniswapv2-amount'

const DexMarketCapInterval = 10_000 // 10s

export const useMarketCap = () => {
  const [marketCap, setMarketCap] = useState('')
  const { tokenInfo, chainId, tradePrice, tradeRecords } = useTokenContext()
  const { getReserves } = useUniswapV2Amount(chainId, tokenInfo?.graduated_pool)

  // Calc DEX market cap
  useInterval(
    async () => {
      const { price = 0 } = tradePrice ?? {}
      const { total_supply = 0 } = tokenInfo ?? {}
      const [reserve0, reserve1] = await getReserves()
      const reserveAmount = formatEther(reserve1)
      const tokenAmount = formatEther(reserve0)

      const marketCap = BigNumber(reserveAmount)
        .div(tokenAmount)
        .multipliedBy(price)
        .multipliedBy(total_supply)
        .toFixed()

      setMarketCap(marketCap)
    },
    tokenInfo?.is_graduated ? DexMarketCapInterval : undefined,
    { immediate: true }
  )

  // Calc market cap
  useEffect(() => {
    if (tokenInfo?.is_graduated) return
    const { start_price = 0, total_supply = 0 } = tokenInfo ?? {}
    const { price = 0 } = tradePrice ?? {}
    const { marketcap } = first(tradeRecords) ?? {}

    const tokenPrice = BigNumber(start_price).multipliedBy(total_supply)
    const marketCap = BigNumber(price).multipliedBy(marketcap || tokenPrice)

    setMarketCap(marketCap.toFixed())
  }, [tokenInfo, tradePrice, tradeRecords])

  return {
    marketCap,
  }
}
