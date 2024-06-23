import { useState } from 'react'
import { Address, formatEther, isAddress, parseEther, zeroAddress } from 'viem'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'
import { useAccount, useWriteContract } from 'wagmi'

import type { DexTradeProps } from '../trade-dex/use-dex-trade'
import { useTradeInfoV2 } from './use-trade-info'
import { CONTRACT_ERR } from '@/errors/contract'
import { addSlippage, subSlippage } from '@/utils/contract'
import { getZapV1Config } from '@/contract/v2/config/zapv1'
import { useApprove } from '@/hooks/use-approve'

// TODO: should be dynamic if use v2.
const referral = zeroAddress

export const useTradeV2 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const [isListed, setIsListed] = useState(false)
  const { query } = useRouter()
  const token = (query.address ?? '') as Address
  const { address, chainId } = useAccount()
  const { approvalForAll } = useApprove()

  const config = getZapV1Config(chainId ?? 0)
  const { checkForToken, getAmountForBuy, getAmountForSell } = useTradeInfoV2()
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
    if (!isAddress(token)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    if (!address) return false
    if (!config) return false

    return true
  }

  const buy = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const [weiNativeAmount] = await getAmountForBuy(token, amount)
    const nativeAmount = BigNumber(formatEther(weiNativeAmount))
    if (nativeAmount.lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isOverflow, isListed, currentMax } = await checkForToken(
      token,
      amount
    )
    setIsListed(isListed)

    if (isOverflow && !isListed) return currentMax
    if (isListed) return dexBuy(amount, token)

    // We can safely use config here,
    // because `checkForTrade` already checked.
    writeContract({
      ...config!,
      functionName: 'mintWithEth',
      args: [token, parseEther(amount), address!, referral],
      // You don't need `addServiceFee`,
      // because `value` is includes service fee.
      value: addSlippage(nativeAmount.toFixed(), slippage),
    })
  }

  const sell = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const [weiNativeAmount] = await getAmountForSell(token, amount)
    const nativeAmount = BigNumber(formatEther(weiNativeAmount))
    if (nativeAmount.lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    // We can safely use config here,
    // because `checkForTrade` already checked.
    const isApproved = await approvalForAll(token, config!.address, amount)
    if (!isApproved) return

    const { isListed } = await checkForToken(token, amount)
    setIsListed(isListed)

    if (isListed) return dexSell(amount, token)

    console.log('v2 internal sell', {
      amount,
      slippage,
      result: formatEther(subSlippage(amount, slippage)),
    })
    writeContract({
      ...config!,
      functionName: 'burnToEth',
      args: [
        token,
        parseEther(amount),
        addSlippage(amount, slippage),
        address!,
        referral,
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
    tradeHashV2: tradeHash,
    isSubmittingV2: isSubmitting,
    buyV2: buy,
    sellV2: sell,
    resetTradeV2: resetTrade,
  }
}
