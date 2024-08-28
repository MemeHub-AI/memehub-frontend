import { useEffect, useRef, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { first } from 'lodash'
import { formatEther } from 'viem'

import { useTokenContext } from '@/contexts/token'
import { useUniswapV2Amount } from './uniswapv2/use-uniswapv2-amount'

const dexMarketCapInterval = 10_000 // 10s

export const useMarketCap = () => {
  const timerRef = useRef<NodeJS.Timeout>()
  const [marketCap, setMarketCap] = useState('')
  const { tokenInfo, chainId, tradePrice, tradeRecords, graduatedPool } =
    useTokenContext()
  const { getReserves } = useUniswapV2Amount(chainId, graduatedPool)

  const calcDexMarketCap = async () => {
    const { total_supply = 0 } = tokenInfo ?? {}
    const { price = 0 } = tradePrice ?? {}

    const reserves = await getReserves()
    const reserveAmount = formatEther(reserves[0])
    const tokenAmount = formatEther(reserves[1])

    const marketCap = BigNumber(reserveAmount)
      .div(tokenAmount)
      .multipliedBy(price)
      .multipliedBy(total_supply)
      .toFixed()

    setMarketCap(marketCap)
  }

  useEffect(() => {
    if (!tokenInfo || !tokenInfo.is_graduated) return

    calcDexMarketCap()
    timerRef.current = setInterval(calcDexMarketCap, dexMarketCapInterval)

    return () => clearInterval(timerRef.current)
  }, [tokenInfo, tradePrice])

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
