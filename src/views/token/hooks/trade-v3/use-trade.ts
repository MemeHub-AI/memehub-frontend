import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Address, formatEther, isAddress, parseEther, zeroAddress } from 'viem'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { DexTradeProps } from '../trade-dex/use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { getV3Config } from '@/contract/v3/config'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { useUserStore } from '@/stores/use-user-store'

export const useTradeV3 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const [isListed, setIsListed] = useState(false)
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { bondingCurveConfig } = getV3Config(chainId)
  const { userInfo } = useUserStore()

  const { getNativeAmount, getTokenAmount, checkForOverflow } = useTradeInfoV3()
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

  const getReferrals = () => {
    const { one, two } = userInfo?.inviter ?? {}
    const parent = (one || zeroAddress) as Address
    const gParent = (two || zeroAddress) as Address

    return [parent, gParent] as const
  }

  const buy = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const nativeAmount = parseEther(amount)
    const tokenAmount = formatEther(await getTokenAmount(amount))
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isListed } = await checkForOverflow(amount)
    setIsListed(isListed)
    const [parent, gParent] = getReferrals()

    console.log('v3 buy', parent, gParent)
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
        [parent, gParent],
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
    const [parent, gParent] = getReferrals()

    console.log('v3 sell', parent, gParent)
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
        [parent, gParent],
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
