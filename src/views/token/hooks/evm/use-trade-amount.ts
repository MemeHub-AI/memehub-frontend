import { readContract } from 'wagmi/actions'
import { Address, parseEther } from 'viem'

import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { BI_ZERO } from '@/constants/number'
import { reportException } from '@/errors'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'

export const useEvmTradeAmount = (chainId: number, tokenAddr: Address) => {
  const { tokenInfo: { bond_version, bond_address } = {} } = useTokenContext()
  const config = {
    abi: bcAbiMap[bond_version!],
    address: bond_address as Address,
    chainId: chainId as ConfigChainId,
  }

  const checkConfig = () => {
    if (!config.abi || !config.address || !chainId) return false
    return true
  }

  /** 1 Token => 0.000000001 ETH */
  const getReserveAmount = async (tokenAmount: string) => {
    if (!checkConfig()) return BI_ZERO

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'calcAmountOutFromToken',
      args: [tokenAddr, parseEther(tokenAmount)],
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
  }

  /** 1 ETH => 100,000,000 Token */
  const getTokenAmount = async (reserveAmount: string) => {
    if (!checkConfig()) return BI_ZERO

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'calcAmountOutFromEth',
      args: [tokenAddr, parseEther(reserveAmount)],
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
  }

  /** Get the last buy order reserve token amount */
  const getLastAmount = async (tokenLeft: string) => {
    if (!checkConfig()) return BI_ZERO

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'calcAmountOutFromTokenCutOff',
      args: [tokenAddr, parseEther(tokenLeft)],
    }).catch(() => BI_ZERO)
  }

  return {
    getTokenAmount,
    getReserveAmount,
    getLastAmount,
  }
}
