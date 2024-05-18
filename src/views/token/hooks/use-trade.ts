import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { Address, formatEther, parseEther } from 'viem'
import { readContract } from '@wagmi/core'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { continousTokenAbi } from '@/contract/continous-token'
import { wagmiConfig } from '@/config/wagmi'
import { toastNoReject } from '@/utils/contract'

export const useTrade = () => {
  const { t } = useTranslation()
  const {
    data: hash,
    isPending,
    writeContractAsync,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSuccess: () => {
        toast.dismiss()
        toast.info(t('submit.success'))
      },
      onError: (e) => {
        toast.dismiss()
        toastNoReject(e)
      },
    },
  })

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  })

  if (isSuccess) {
    toast.success(t('trade.success'))
  }

  if (isError) {
    toast.error(t('trade.failed'))
  }

  if (isSuccess || isError) {
    reset()
  }

  const checkTrade = async (address: Address) => {
    const result = { totalAmount: BigInt(0), currentAmount: BigInt(0) }
    const id = toast.loading(t('trade.checking'))

    try {
      const totalAmount = await readContract(wagmiConfig, {
        abi: continousTokenAbi,
        address,
        functionName: 'ETH_AMOUNT',
      })
      const currentAmount = await readContract(wagmiConfig, {
        abi: continousTokenAbi,
        address,
        functionName: 'raiseEthAmount',
      })
      result.totalAmount = totalAmount
      result.currentAmount = currentAmount
      return result
    } catch (error) {
      return result
    } finally {
      toast.dismiss(id)
    }
  }

  const canMintAmount = async (address: Address) => {
    try {
      const amount = await readContract(wagmiConfig, {
        abi: continousTokenAbi,
        address,
        functionName: 'CAN_MINI',
      })
      return formatEther(amount)
    } catch (error) {}
  }

  const buy = async (amount: string, address: Address) => {
    const total = BigNumber(amount).multipliedBy(0.01).plus(amount)
    const value = parseEther(total.toFormat())

    try {
      await writeContractAsync({
        abi: continousTokenAbi,
        address,
        functionName: 'mint',
        args: [parseEther(amount.toString())],
        value,
      })
    } catch (e) {
      console.log('buy error:')
      console.error(e)
      toastNoReject(e)
    }
  }

  const sell = async (amount: string, address: Address) => {
    try {
      await writeContractAsync({
        abi: continousTokenAbi,
        address,
        functionName: 'burn',
        args: [parseEther(amount.toString())],
      })
    } catch (e) {
      toastNoReject(e)
    }
  }

  return {
    tradeHash: hash,
    isTrading: isPending || isLoading,
    buy,
    sell,
    reset,
    checkTrade,
  }
}
