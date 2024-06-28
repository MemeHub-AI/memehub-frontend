import { readContract } from 'wagmi/actions'
import { formatEther, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { wagmiConfig } from '@/config/wagmi'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'
import { BI_ZERO } from '@/constants/contract'
import { useTradeSearchParams } from '../use-search-params'

export const useTradeInfoV3 = () => {
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { bondingCurveConfig } = getV3Config(chainId)

  const getTotalSupply = async () => {
    if (!bondingCurveConfig) return BI_ZERO
    return readContract(wagmiConfig, {
      ...bondingCurveConfig,
      functionName: 'maxSupply_',
      chainId,
    }).catch((e) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  const getDetails = (token = tokenAddr) => {
    if (!bondingCurveConfig) return [] as const
    return readContract(wagmiConfig, {
      ...bondingCurveConfig,
      functionName: 'pools_',
      args: [token],
      chainId,
    }).catch((e) => {
      console.error(e.message)
      return [] as const
    })
  }

  const getNativeAmount = async (amount: string) => {
    if (!bondingCurveConfig) return BI_ZERO
    const value = await readContract(wagmiConfig, {
      ...bondingCurveConfig,
      functionName: 'calcAmountOutFromToken',
      args: [tokenAddr, parseEther(amount)],
      chainId,
    }).catch((e) => {
      console.error(e.message)
      return BI_ZERO
    })
    return BigInt(value)
  }

  const getTokenAmount = async (amount: string) => {
    if (!bondingCurveConfig) return BI_ZERO

    const value = await readContract(wagmiConfig, {
      ...bondingCurveConfig,
      functionName: 'calcAmountOutFromEth',
      chainId,
      args: [tokenAddr, parseEther(amount)],
    }).catch((e) => {
      console.error(e.message)
      return BI_ZERO
    })

    return value
  }

  const getPrice = () => {
    if (!bondingCurveConfig) return BI_ZERO

    return readContract(wagmiConfig, {
      ...bondingCurveConfig,
      functionName: 'calcPrice',
      args: [tokenAddr],
      chainId,
    })
  }

  const checkForOverflow = async (amount: string) => {
    const [amonutForBuy, totalSupply, [, leftSupply = BI_ZERO]] =
      await Promise.all([
        getTokenAmount(amount),
        getTotalSupply(),
        getDetails(),
      ])
    const total = formatEther(totalSupply)
    const current = formatEther(leftSupply)
    const tokenAmount = formatEther(amonutForBuy)
    const isOverflow = BigNumber(tokenAmount).gte(current)
    const isListed = BigNumber(current).eq(0)

    return {
      total,
      current,
      isOverflow,
      isListed,
    }
  }

  const getLastOrderAmount = async (currentLeft: string, token = tokenAddr) => {
    const amount = await readContract(wagmiConfig, {
      ...bondingCurveConfig!,
      functionName: 'calcAmountOutFromTokenCutOff',
      args: [token, parseEther(currentLeft)],
    }).catch(() => BI_ZERO)

    return formatEther(amount)
  }

  return {
    getTotalSupply,
    getDetails,
    getNativeAmount,
    getTokenAmount,
    getPrice,
    checkForOverflow,
    getLastOrderAmount,
  }
}
