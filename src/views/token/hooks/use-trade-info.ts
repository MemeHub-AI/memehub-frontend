import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { Address, formatEther, parseEther } from 'viem'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

import { SupportedChainId, wagmiConfig } from '@/config/wagmi'
import { continousTokenAbi } from '@/contract/abi/continous-token'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useTradeInfo = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const tokenAddress = query.address as Address
  const { chainId } = useChainInfo()

  // Query native & token balance.
  const {
    data: nativeBalances,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({ address, chainId })
  const {
    data: tokenBalances,
    isFetching: isFetchingTokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    abi: continousTokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    chainId,
    args: [address!],
    query: { enabled: !!address },
  })
  const nativeBalance = formatEther(nativeBalances?.value || BigInt(0))
  const tokenBalance = formatEther(tokenBalances || BigInt(0))

  // Get buy token amount from native token.
  const getBuyTokenAmount = async (address: Address, nativeToken: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousMintReturn',
      chainId: chainId as SupportedChainId,
      args: [parseEther(nativeToken)],
    }).catch((e) => {
      console.error('[getBuyTokenAmount Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get sell token amount from native token.
  const getSellTokenAmount = async (address: Address, nativeToken: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousBurnReturn',
      chainId: chainId as SupportedChainId,
      args: [parseEther(nativeToken)],
    }).catch((e) => {
      console.error('[getSellTokenAmount Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get buy token required native token amount.
  const getBuyTokenEthAmount = async (
    address: Address,
    nativeToken: string
  ) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'fundCostByContinuous',
      chainId: chainId as SupportedChainId,
      args: [parseEther(nativeToken)],
    }).catch((e) => {
      console.error('[getBuyTokenEthAmount Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get token price.
  const getPrice = async (address: Address) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'getPrice',
      chainId: chainId as SupportedChainId,
    }).catch((e) => {
      console.error('[getPrice Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get token amounts, used for calc percent.
  const getTokenAmounts = async (
    address: Address,
    overrideChainId = chainId as SupportedChainId
  ) => {
    const zero = BigInt(0)

    try {
      const [t, c] = await readContracts(wagmiConfig, {
        contracts: [
          {
            abi: continousTokenAbi,
            address,
            chainId: overrideChainId,
            functionName: 'ETH_AMOUNT',
          },
          {
            abi: continousTokenAbi,
            address,
            chainId: overrideChainId,
            functionName: 'raiseEthAmount',
          },
        ],
      })
      return [t.result || zero, c.result || zero]
    } catch (e) {
      console.error('[getTokenAmounts Error]:', e)
      return [zero, zero]
    }
  }

  // Get avaiable to buy of token amount.
  const getAvailableTokenAmount = async (address: Address) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'CAN_MINI',
      chainId: chainId as SupportedChainId,
    }).catch((e) => {
      console.error('[getAvailableTokenAmount Error]:', e)
      return BigInt(0)
    })

    return formatEther(data)
  }

  // Check if the amount exceeds the current max available.
  const checkForOverflow = async (amount: string) => {
    const [totalAmount, currentAmount] = await getTokenAmounts(
      tokenAddress
    ).catch((e) => {
      console.error('[checkForOverflow Error]:', e)
      return [BigInt(0), BigInt(0)]
    })
    const total = formatEther(totalAmount)
    const current = formatEther(currentAmount)
    const currentMax = BigNumber(total).minus(current)

    return {
      total,
      current,
      currentMax: currentMax.toString(),
      isOverflow: BigNumber(amount).gt(currentMax),
    }
  }

  return {
    nativeBalance,
    tokenBalance,
    isFetchingBalance: isFetchingNativeBalance || isFetchingTokenBalance,
    getBuyTokenAmount,
    getSellTokenAmount,
    getBuyTokenEthAmount,
    getPrice,
    getTokenAmounts,
    getAvailableTokenAmount,
    checkForOverflow,
    refetchNativeBalance,
    refetchTokenBalance,
  }
}
