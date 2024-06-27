import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther } from 'viem'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { DexTradeProps } from '../trade-dex/use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { getV3Config } from '@/contract/v3/config'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { useInvite } from '../use-invite'

export const useTradeV3 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const [isListed, setIsListed] = useState(false)
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { bondingCurveConfig } = getV3Config(chainId)
  const { getReferrals } = useInvite()

  const { getNativeAmount, getTokenAmount, checkForOverflow, calcLastBuy } =
    useTradeInfoV3()
  const {
    data: internalHash,
    isPending: isInternalTrading,
    writeContract,
    reset: resetInternalTrade,
  } = useWriteContract({
    mutation: { onError: (e) => CONTRACT_ERR.exec(e) },
  })
  const tradeHash = isListed ? dexHash : internalHash
  const isSubmitting = isListed ? isDexTrading : isInternalTrading

  const checkForTrade = (amount: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    if (!isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    if (!address || !bondingCurveConfig) return false

    return true
  }

  const buy = async (
    amount: string,
    slippage: string,
    setValue?: (v: string) => void
  ) => {
    if (!checkForTrade(amount)) return

    const nativeAmount = parseEther(amount)
    const tokenAmount = formatEther(await getTokenAmount(amount))
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isListed, isOverflow, currentLeft } = await checkForOverflow(amount)
    setIsListed(isListed)

    if (isOverflow) {
      calcLastBuy(currentLeft).then((value) => {
        setValue?.(formatEther(value))
      })
      return
    }

    console.log('v3 buy', getReferrals(), currentLeft)
    if (isListed) return dexBuy(amount, tokenAddr)
    writeContract({
      ...bondingCurveConfig!,
      functionName: 'mint',
      args: [
        tokenAddr,
        nativeAmount,
        subSlippage(tokenAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
      value: nativeAmount,
    })
  }

  const sell = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const nativeAmount = formatEther(await getNativeAmount(amount))
    if (BigNumber(nativeAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isListed } = await checkForOverflow(amount)
    setIsListed(isListed)

    console.log('v3 sell', getReferrals())
    if (isListed) return dexSell(amount, tokenAddr)
    writeContract({
      ...bondingCurveConfig!,
      functionName: 'burn',
      args: [
        tokenAddr,
        parseEther(amount),
        subSlippage(nativeAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
    })
  }

  const resetTrade = () => {
    resetInternalTrade()
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
