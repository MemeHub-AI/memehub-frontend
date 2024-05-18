import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { toast } from 'sonner'
import { Address, formatEther, parseEther } from 'viem'
import { readContract } from '@wagmi/core'

import {
  continosTokenConfig,
  continousTokenAbi,
} from '@/contract/continous-token'
import { factoryAddress } from '@/contract/address'
import { useDeploy } from '@/views/create/hooks/use-deploy'
import { wagmiConfig } from '@/config/wagmi'

export const useTrade = () => {
  const {
    data: hash,
    isPending,
    writeContractAsync,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading('Trading...'),
      onSuccess: () => toast.dismiss(),
      onError: () => toast.dismiss(),
    },
  })

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  })

  const { staticDeploy } = useDeploy()

  const checkTrade = async (address: Address) => {
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

    return { totalAmount, currentAmount }
  }

  const buy = async (value: number) => {
    const amount = BigInt(parseEther(String(value + value * 0.01)))

    try {
      const { result } = await staticDeploy('asd', 'd')
      const { totalAmount, currentAmount } = await checkTrade(result)

      console.log('check', formatEther(totalAmount), formatEther(currentAmount))

      return

      await writeContractAsync({
        abi: continousTokenAbi,
        address: result,
        functionName: 'mint',
        args: [amount],
        value: amount,
      })
    } catch (error) {
      toast.error(String(error))
    }
  }

  const sell = async (value: number) => {
    try {
      await writeContractAsync({
        abi: continousTokenAbi,
        address: factoryAddress,
        functionName: 'burn',
        args: [BigInt(value)],
      })
    } catch (error) {
      toast.error(String(error))
    }
  }

  return {
    tradeHash: hash,
    isTrading: isPending || isLoading,
    isTradeSuccess: isSuccess,
    isTradeError: isError,
    buy,
    sell,
    reset,
    checkTrade,
  }
}
