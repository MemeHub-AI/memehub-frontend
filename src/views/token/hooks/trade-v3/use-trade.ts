import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { useRouter } from 'next/router'
import { Address, formatEther, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'

import { DexTradeProps } from '../trade-dex/use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { getV3Config } from '@/contract/v3/config'
import { addSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'

// offset unit is seconds.
const getDeadline = (offset = 3) => {
  const ts = BigNumber(dayjs().unix()).plus(offset).toFixed(0)
  return BigInt(ts)
}

export const useTradeV3 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const [isListed] = useState(false)
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { query } = useRouter()
  const token = (query.address ?? '') as Address
  const config = getV3Config(chainId)

  const { getNativeAmount, getTokenAmount } = useTradeInfoV3()
  const {
    data: internalHash,
    isPending: isInternalTrading,
    writeContract,
    reset: resetInternalTrade,
  } = useWriteContract({
    mutation: { onError: (e) => CONTRACT_ERR.exec(e) },
  })
  const tradeHash = dexHash || internalHash
  const isSubmitting = isDexTrading || isInternalTrading

  const buy = async (amount: string, slippage: string) => {
    const slippagedValue = addSlippage(amount, slippage)

    console.log('v3 buy', amount, slippage, getDeadline())
    writeContract({
      ...config!.bondingCurveConfig,
      functionName: 'mint',
      args: [
        token,
        slippagedValue,
        slippagedValue,
        address!,
        getDeadline(),
        [],
      ],
      value: slippagedValue,
    })
  }

  const sell = async (amount: string, slippage: string) => {
    const nativeAmount = await getNativeAmount(String(2_000))

    console.log('v3 sell', amount, slippage, formatEther(nativeAmount))
    writeContract({
      ...config!.bondingCurveConfig,
      functionName: 'burn',
      args: [
        token,
        parseEther(amount),
        addSlippage(formatEther(nativeAmount), slippage),
        address!,
        getDeadline(),
        [],
      ],
    })
  }

  const resetTrade = () => {
    dexReset()
  }

  return {
    tradeHash,
    isSubmitting,
    buy,
    sell,
    resetTrade,

    // alias
    tradeHashV3: tradeHash,
    isSubmittingV3: isSubmitting,
    buyV3: buy,
    sellV3: sell,
    resetTradeV3: resetTrade,
  }
}
