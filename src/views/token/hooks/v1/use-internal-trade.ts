import { useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { type Address, isAddress, parseEther } from 'viem'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { v1ContinousTokenAbi } from '@/contract/v1/abi/continous-token'
import { addServiceFeeV1 } from '@/utils/contract'
import { CONTRACT_ERR } from '@/errors/contract'

export const useInternalTradeV1 = () => {
  const { t } = useTranslation()

  const {
    data: hash,
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

  const internalBuy = (amount: string, token: Address) => {
    if (!checkForTrade(amount, token)) return

    console.log('v1 internal buy', amount, token)
    writeContract({
      abi: v1ContinousTokenAbi,
      address: token,
      functionName: 'mint',
      args: [parseEther(amount)],
      value: addServiceFeeV1(amount),
    })
  }

  const internalSell = (amount: string, token: Address) => {
    if (!checkForTrade(amount, token)) return

    console.log('v1 internal sell', amount, token)
    writeContract({
      abi: v1ContinousTokenAbi,
      address: token,
      functionName: 'burn',
      args: [parseEther(amount)],
    })
  }

  return {
    internalHash: hash,
    isInternalTrading,
    internalBuy,
    internalSell,
    resetInternalTrade,
  }
}
