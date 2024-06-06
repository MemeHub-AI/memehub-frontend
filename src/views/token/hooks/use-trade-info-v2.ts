import { useEffect } from 'react'
import { Address, parseEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core/actions'

import { v2BondAbi } from '@/contract/v2/abi/bond'
import { v2Addr } from '@/contract/v2/address'
import { wagmiConfig } from '@/config/wagmi'
import { v2TokenAbi } from '@/contract/v2/abi/token'

export const useTradeInfoV2 = () => {
  const { address } = useAccount()

  const {
    data: nativeBalance,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance()
  const {
    data: tokenBalance,
    isFetching: isFetchingTokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    abi: v2TokenAbi,
    address: v2Addr.bond[97],
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })

  console.log('address', tokenBalance)

  const getBuyTokenAmount = async (address: Address, amount: string) => {
    const data = await readContract(wagmiConfig, {
      abi: v2BondAbi,
      address: v2Addr.bond[97],
      functionName: 'getReserveForToken',
      args: [address, parseEther(amount)],
    })

    console.log('read', data)
    try {
    } catch (error) {
      console.error('[v2 getBuyTokenAmount Error]', error)
    }
  }

  useEffect(() => {
    // getBuyTokenAmount('0xcc27db6158c2971Af3366e8FEBa5049B64534105', '0.001')
  }, [])

  return {
    nativeBalance,
    tokenBalance,
    isFetchingNativeBalance,
    isFetchingTokenBalance,
    refetchNativeBalance,
    refetchTokenBalance,
  }
}
