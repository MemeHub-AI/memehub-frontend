import { useReadContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Address, formatEther, parseEther, zeroAddress } from 'viem'
import { BigNumber } from 'bignumber.js'
import { last } from 'lodash'

import { wagmiConfig } from '@/config/wagmi'
import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/number'
import { useTradeSearchParams } from '../use-search-params'
import { v3Addr } from '@/contract/v3/address'
import { v3TokenAbi } from '@/contract/v3/abi/token'
import { v3BondingCurveAbi } from '@/contract/v3/abi/bonding-curve'
import { reportException } from '@/errors'

export const useTradeInfoV3 = (overrideToken?: Address) => {
  const { chainId } = useChainInfo()
  const { tokenAddr: queryToken } = useTradeSearchParams()
  const tokenAddr = overrideToken ?? queryToken
  const { bondingCurve } = v3Addr[chainId] ?? {}

  const { data = BI_ZERO } = useReadContract({
    abi: v3TokenAbi,
    address: tokenAddr,
    chainId,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddr },
  })
  const totalSupply = BigNumber(formatEther(data)).toFixed()

  const getMaxSupply = async () => {
    if (!bondingCurve) return BI_ZERO

    return readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'maxSupply_',
      chainId,
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
  }

  const getDetails = async (token = tokenAddr) => {
    if (!bondingCurve) return [] as const

    return readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'pools_',
      chainId,
      args: [token],
    }).catch((e) => {
      reportException(e)
      return [] as const
    })
  }

  const getNativeAmount = async (amount: string) => {
    if (!bondingCurve) return BI_ZERO

    const value = await readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'calcAmountOutFromToken',
      args: [tokenAddr, parseEther(amount)],
      chainId,
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })
    return BigInt(value)
  }

  const getTokenAmount = async (amount: string) => {
    if (!bondingCurve) return BI_ZERO

    const value = await readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'calcAmountOutFromEth',
      chainId,
      args: [tokenAddr, parseEther(amount)],
    }).catch((e) => {
      reportException(e)
      return BI_ZERO
    })

    return value
  }

  const getPrice = () => {
    if (!bondingCurve) return BI_ZERO

    return readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'calcPrice',
      args: [tokenAddr],
      chainId,
    })
  }

  const checkForOverflow = async (amount: string) => {
    const [amonutForBuy, totalSupply, [, leftSupply = BI_ZERO]] =
      await Promise.all([getTokenAmount(amount), getMaxSupply(), getDetails()])
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

  const checkForListed = async () => {
    const headmaster = last(await getDetails())
    return !!(headmaster && headmaster !== zeroAddress)
  }

  const getLastOrderAmount = async (currentLeft: string, token = tokenAddr) => {
    if (!bondingCurve) return '0'

    const amount = await readContract(wagmiConfig, {
      abi: v3BondingCurveAbi,
      address: bondingCurve,
      functionName: 'calcAmountOutFromTokenCutOff',
      args: [token, parseEther(currentLeft)],
    }).catch(() => BI_ZERO)

    return formatEther(amount)
  }

  return {
    totalSupply,
    getMaxSupply,
    getDetails,
    getNativeAmount,
    getTokenAmount,
    getPrice,
    checkForOverflow,
    checkForListed,
    getLastOrderAmount,
  }
}
