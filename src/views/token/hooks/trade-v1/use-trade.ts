import { useState } from 'react'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { isEmpty } from 'lodash'

import type { DexTradeProps } from '../trade-dex/use-dex-trade'
import { useTradeInfoV1 } from './use-trade-info'
import { CONTRACT_ERR } from '@/errors/contract'
import { v1ContinousTokenAbi } from '@/contract/v1/abi/continous-token'
import { addServiceFee } from '@/utils/contract'

export const useTradeV1 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const { t } = useTranslation()
  const [isInternalTrade, setIsInternalTrade] = useState(true)
  const { query } = useRouter()
  const token = (query.address || '') as Address

  const { checkForOverflow } = useTradeInfoV1()
  const {
    data: internalHash,
    isPending: isInternalTrading,
    writeContract,
    reset: internalTradeReset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })
  const hash = isInternalTrade ? internalHash : dexHash
  const isSubmitting = isInternalTrading || isDexTrading

  const checkForTrade = (amount: string, token: Address) => {
    if (isEmpty(amount)) {
      toast.error(t('contract.err.amount'))
      return false
    }
    if (!isAddress(token)) {
      toast.error(t('contract.err.token-addr'))
      return false
    }

    return true
  }

  const checkForInternal = async (amount: string) => {
    const { currentMax, isOverflow } = await checkForOverflow(amount)
    const isInternal = !BigNumber(currentMax).eq(0)

    return {
      isInternal,
      currentMax,
      isOverflow,
    }
  }

  const buy = async (
    amount: string,
    slippage: string,
    setValue?: (value: string) => void
  ) => {
    if (!checkForTrade(amount, token)) return

    const { isInternal, isOverflow, currentMax } = await checkForInternal(
      amount
    )
    setIsInternalTrade(isInternal)

    if (!isInternal) return dexBuy(amount, token)
    // Internal buy but overflow current max value.
    if (isInternal && isOverflow) {
      setValue?.(currentMax)
      toast.error(
        t('trade.limit').replace('{}', currentMax).replace('{}', t('buy'))
      )
      return
    }

    console.log('v1 internal buy', amount, token)
    writeContract({
      abi: v1ContinousTokenAbi,
      address: token,
      functionName: 'mint',
      args: [parseEther(amount)],
      value: addServiceFee(amount),
    })
  }

  const sell = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount, token)) return

    const { isInternal } = await checkForInternal(amount)
    setIsInternalTrade(isInternal)

    if (!isInternal) return dexSell(amount, token)

    console.log('v1 internal sell', amount, token)
    writeContract({
      abi: v1ContinousTokenAbi,
      address: token,
      functionName: 'burn',
      args: [parseEther(amount)],
    })
  }

  const resetTrade = () => {
    internalTradeReset()
    dexReset()
  }

  return {
    tradeHash: hash,
    isSubmitting,
    buy,
    sell,
    resetTrade,

    // alias
    tradeHashV1: hash,
    isSubmittingV1: isSubmitting,
    buyV1: buy,
    sellV1: sell,
    resetTradeV1: resetTrade,
  }
}
