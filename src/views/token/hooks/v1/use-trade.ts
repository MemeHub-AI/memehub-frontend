import { useState } from 'react'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { isEmpty } from 'lodash'

import type { DexTradeProps } from '../use-trade'
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
    reset: resetInternalTrade,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })
  const hash = isInternalTrade ? internalHash : dexHash
  const isSubmittingV1 = isInternalTrading || isDexTrading

  const checkForTrade = (amount: string, token: Address) => {
    if (isEmpty(amount)) {
      toast.error(t('trade.amount.invalid'))
      return false
    }
    if (!isAddress(token)) {
      toast.error(t('trade.token.invalid'))
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

  const buyV1 = async (amount: string) => {
    if (!checkForTrade(amount, token)) return

    const { isInternal, isOverflow, currentMax } = await checkForInternal(
      amount
    )
    setIsInternalTrade(isInternal)

    // Internal buy but overflow current max value.
    if (isInternal && isOverflow) return currentMax
    if (!isInternal) return dexBuy(amount, token)

    console.log('v1 internal buy', amount, token)
    writeContract({
      abi: v1ContinousTokenAbi,
      address: token,
      functionName: 'mint',
      args: [parseEther(amount)],
      value: addServiceFee(amount),
    })
  }

  const sellV1 = async (amount: string) => {
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

  const resetTradeV1 = () => {
    resetInternalTrade()
    dexReset()
  }

  return {
    tradeHashV1: hash,
    isSubmittingV1,
    buyV1,
    sellV1,
    resetTradeV1,
  }
}
