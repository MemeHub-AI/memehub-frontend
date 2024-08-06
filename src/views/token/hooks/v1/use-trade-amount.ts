import { readContract } from 'wagmi/actions'
import { formatEther, parseEther } from 'viem'

import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { BI_ZERO } from '@/constants/number'
import { reportException } from '@/errors'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'

export const useTradeAmount = () => {
  const { tokenAddr, chainId, bcVersion, bcAddr } = useTokenContext()

  /** 1 Token => 0.000000001 ETH */
  const getReserveAmount = async (tokenAmount: string) => {
    if (!bcVersion || !bcAddr) return BI_ZERO

    return readContract(wagmiConfig, {
      abi: bondingCurveAbiMap[bcVersion],
      address: bcAddr,
      chainId: chainId as ConfigChainId,
      functionName: 'calcAmountOutFromToken',
      args: [tokenAddr, parseEther(tokenAmount)],
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
  }

  /** 1 ETH => 100,000,000 Token */
  const getTokenAmount = async (reserveAmount: string) => {
    if (!bcVersion || !bcAddr) return BI_ZERO

    return readContract(wagmiConfig, {
      abi: bondingCurveAbiMap[bcVersion],
      address: bcAddr,
      chainId: chainId as ConfigChainId,
      functionName: 'calcAmountOutFromEth',
      args: [tokenAddr, parseEther(reserveAmount)],
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
  }

  /** Get the last buy order reserve token amount */
  const getLastOrderAmount = async (tokenLeft: string) => {
    if (!bcVersion || !bcAddr) return BI_ZERO

    return readContract(wagmiConfig, {
      abi: bondingCurveAbiMap[bcVersion],
      address: bcAddr,
      functionName: 'calcAmountOutFromTokenCutOff',
      args: [tokenAddr, parseEther(tokenLeft)],
    }).catch(() => BI_ZERO)
  }

  return {
    getReserveAmount,
    getTokenAmount,
    getLastOrderAmount,
  }
}
