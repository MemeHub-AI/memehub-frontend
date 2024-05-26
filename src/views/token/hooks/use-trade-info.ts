import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { Address, formatEther, parseEther } from 'viem'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

import { wagmiConfig } from '@/config/wagmi'
import { continousTokenAbi } from '@/contract/abi/continous-token'

export const useTradeInfo = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const tokenAddress = query.address as Address

  // Query native & token balance.
  const { data: ethBalances } = useBalance({ address })
  const { data: tokenBalances } = useReadContract({
    abi: continousTokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })
  const ethBalance = formatEther(ethBalances?.value || BigInt(0))
  const tokenBalance = formatEther(tokenBalances || BigInt(0))

  // Get buy token amount from eth.
  const getBuyTokenAmount = async (address: Address, eth: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousMintReturn',
      args: [parseEther(eth)],
    }).catch((e) => {
      console.error('[getBuyTokenAmount Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get sell token amount from eth
  const getSellTokenAmount = async (address: Address, eth: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'calculateContinuousBurnReturn',
      args: [parseEther(eth)],
    }).catch((e) => {
      console.error('[getSellTokenAmount Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get buy token required eth amount.
  const getBuyTokenEthAmount = async (address: Address, eth: string) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'fundCostByContinuous',
      args: [parseEther(eth)],
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
    }).catch((e) => {
      console.error('[getPrice Error]:', e)
      return BigInt(0)
    })

    return data
  }

  // Get token amounts, used for calc percent.
  const getTokenAmounts = async (address: Address) => {
    const zero = BigInt(0)

    try {
      const [t, c] = await readContracts(wagmiConfig, {
        contracts: [
          { abi: continousTokenAbi, address, functionName: 'ETH_AMOUNT' },
          { abi: continousTokenAbi, address, functionName: 'raiseEthAmount' },
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
      currentMax: currentMax.toString(),
      isOverflow: BigNumber(amount).gt(currentMax),
    }
  }

  return {
    ethBalance,
    tokenBalance,
    getBuyTokenAmount,
    getSellTokenAmount,
    getBuyTokenEthAmount,
    getPrice,
    getTokenAmounts,
    getAvailableTokenAmount,
    checkForOverflow,
  }
}
