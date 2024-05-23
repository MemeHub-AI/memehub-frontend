import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { Address, formatEther, parseEther } from 'viem'
import { useRouter } from 'next/router'

import { wagmiConfig } from '@/config/wagmi'
import { continousTokenAbi } from '@/contract/continous-token'

export const useTradeInfo = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const tokenAddress = query.address as Address

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
    })

    return data
  }

  // Get token price.
  const getPrice = async (address: Address) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'getPrice',
    })

    return data
  }

  // Get token amounts, used for calc percent.
  const getTokenAmounts = async (address: Address) => {
    const zero = BigInt(0)

    return readContracts(wagmiConfig, {
      contracts: [
        { abi: continousTokenAbi, address, functionName: 'ETH_AMOUNT' },
        { abi: continousTokenAbi, address, functionName: 'raiseEthAmount' },
      ],
    })
      .then(([t, c]) => [t.result || zero, c.result || zero])
      .catch(() => [zero, zero])
  }

  // Get avaiable to buy of token amount.
  const getAvailableTokenAmount = async (address: Address) => {
    const data = await readContract(wagmiConfig, {
      abi: continousTokenAbi,
      address,
      functionName: 'CAN_MINI',
    })

    return formatEther(data)
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
  }
}
