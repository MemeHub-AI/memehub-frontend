import { Address, formatEther, parseEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core/actions'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

import { wagmiConfig } from '@/config/wagmi'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getTokenConfig } from '@/contract/v2/config/token'
import { getBondConfig } from '@/contract/v2/config/bond'
import { ERR } from '@/errors'
import { BI_ZERO, BI_ZERO_TUPLE } from '@/constants/contract'

export const useTradeInfoV2 = () => {
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { query } = useRouter()
  const token = (query.address ?? '') as Address

  const tokenConfig = getTokenConfig(chainId)
  const [bondConfig] = getBondConfig(chainId) || []

  const {
    data: nativeData,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({ address, chainId })
  const {
    data: tokenData,
    isFetching: isFetchingTokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    ...tokenConfig!,
    address: token,
    functionName: 'balanceOf',
    chainId,
    args: [address!],
    query: { enabled: !!address && !!tokenConfig },
  })
  const nativeBalance = formatEther(nativeData?.value ?? BigInt(0))
  const tokenBalance = formatEther(tokenData ?? BigInt(0))
  const isFetchingBalance = isFetchingNativeBalance || isFetchingTokenBalance

  const {
    data: tokenDetails,
    isFetching: isFetchingTokenDetails,
    refetch: refetchTokenDetails,
  } = useReadContract({
    ...bondConfig!,
    functionName: 'getDetail',
    chainId,
    args: [token],
    query: { enabled: !!token && !!bondConfig },
  })

  const getAmountForBuy = async (token: Address, amount: string) => {
    if (!bondConfig || BigNumber(amount).lte(0)) return BI_ZERO_TUPLE

    return readContract(wagmiConfig, {
      ...bondConfig,
      chainId,
      functionName: 'getReserveForToken',
      args: [token, parseEther(amount)],
    }).catch((e) => {
      ERR.contract(e, false)
      return BI_ZERO_TUPLE
    })
  }

  const getAmountForSell = async (token: Address, amount: string) => {
    if (!bondConfig || BigNumber(amount).lte(0)) return BI_ZERO_TUPLE

    return readContract(wagmiConfig, {
      ...bondConfig,
      chainId,
      functionName: 'getRefundForTokens',
      args: [token, parseEther(amount)],
    }).catch((e) => {
      ERR.contract(e, false)
      return BI_ZERO_TUPLE
    })
  }

  const getTokenPrice = async (token: Address) => {
    if (!bondConfig) return BI_ZERO

    return readContract(wagmiConfig, {
      ...bondConfig,
      chainId,
      functionName: 'priceForNextMint',
      args: [token],
    }).catch((e) => {
      ERR.contract(e, false)
      return BI_ZERO
    })
  }

  const getTokenMaxSupply = async (token: Address) => {
    if (!bondConfig) return BI_ZERO

    return readContract(wagmiConfig, {
      ...bondConfig,
      chainId,
      functionName: 'maxSupply',
      args: [token],
    }).catch((e) => {
      ERR.contract(e, false)
      return BI_ZERO
    })
  }

  const getTokenDetails = async (token: Address) => {
    if (!bondConfig) return undefined

    return readContract(wagmiConfig, {
      ...bondConfig,
      chainId,
      functionName: 'getDetail',
      args: [token],
    }).catch((e) => {
      ERR.contract(e, false)
      return undefined
    })
  }

  const checkForToken = async (token: Address, amount: string) => {
    const { info } = (await getTokenDetails(token)) ?? {}
    const total = formatEther(info?.maxSupply ?? BI_ZERO)
    const current = formatEther(info?.currentSupply ?? BI_ZERO)
    const currentMax = BigNumber(total).minus(current).toFixed()
    const isOverflow = BigNumber(amount).gt(currentMax)
    const isListed = BigNumber(currentMax).lte(0)

    return {
      total,
      current,
      currentMax,
      isOverflow,
      isListed,
    }
  }

  return {
    nativeBalance,
    tokenBalance,
    tokenDetails,
    isFetchingTokenDetails,
    isFetchingNativeBalance,
    isFetchingTokenBalance,
    isFetchingBalance,
    refetchNativeBalance,
    refetchTokenBalance,
    refetchTokenDetails,
    getAmountForBuy,
    getAmountForSell,
    getTokenPrice,
    getTokenMaxSupply,
    getTokenDetails,
    checkForToken,
  }
}
