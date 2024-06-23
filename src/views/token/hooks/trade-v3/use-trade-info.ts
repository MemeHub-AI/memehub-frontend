import { readContract } from 'wagmi/actions'
import { useRouter } from 'next/router'
import { Address, parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'

export const useTradeInfoV3 = () => {
  const { chainId } = useChainInfo()
  const { query } = useRouter()
  const token = (query.address ?? '') as Address
  const config = getV3Config(chainId)

  const getNativeAmount = (amount: string) => {
    return readContract(wagmiConfig, {
      ...config!.bondingCurveConfig,
      functionName: 'calcAmountOutFromToken',
      args: [token, parseEther(amount)],
    })
  }

  const getTokenAmount = (amount: string) => {
    return readContract(wagmiConfig, {
      ...config!.bondingCurveConfig,
      functionName: 'calcAmountOutFromEth',
      args: [token, parseEther(amount)],
    })
  }

  const getPrice = () => {
    return readContract(wagmiConfig, {
      ...config!.bondingCurveConfig,
      functionName: 'calcPrice',
      args: [token],
    })
  }

  return {
    getNativeAmount,
    getTokenAmount,
    getPrice,
  }
}
