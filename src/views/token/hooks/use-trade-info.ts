import { readContract } from '@wagmi/core'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Address, formatEther, parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { continousTokenAbi } from '@/contract/continous-token'

export const useTradeInfo = (address: Address) => {
  const { t } = useTranslation()

  const getBuyTokenFromEth = async (amount: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousMintReturn',
      args: [parseEther(amount)],
    })

    return data
  }

  const getSellTokenFromEth = async (amount: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousBurnReturn',
      args: [parseEther(amount)],
    })

    return data
  }

  const getTokenRequiredEth = async (amount: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'fundCostByContinuous',
      args: [parseEther(amount)],
    })

    return data
  }

  const getPrice = async () => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'getPrice',
    })

    return data
  }

  const getTotalCurrent = async (disableToast = false) => {
    const result = { totalAmount: BigInt(0), currentAmount: BigInt(0) }
    const id = disableToast ? '' : toast.loading(t('trade.checking'))

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
      if (!disableToast) {
        toast.dismiss(id)
      }
    }
  }

  const getAvailableToken = async () => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'CAN_MINI',
    })

    return formatEther(data)
  }

  return {
    getBuyTokenFromEth,
    getSellTokenFromEth,
    getTokenRequiredEth,
    getPrice,
    getTotalCurrent,
    getAvailableToken,
  }
}
