import { Address, parseEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core/actions'

import { wagmiConfig } from '@/config/wagmi'
import { v2Addr } from '@/contract/v2/address'
import { v2BondAbi } from '@/contract/v2/abi/bond'
import { v2TokenAbi } from '@/contract/v2/abi/token'

const chainId = 97

export const useTradeInfoV2 = () => {
  const { address } = useAccount()

  const {
    data: nativeBalance,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({ address })
  const {
    data: tokenBalance = BigInt(0),
    isFetching: isFetchingTokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    abi: v2TokenAbi,
    address: v2Addr[chainId].token,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })

  const getBuyTokenAmount = async (address: Address, amount: string) => {
    try {
      const data = await readContract(wagmiConfig, {
        abi: v2BondAbi,
        address: v2Addr[chainId].bond,
        functionName: 'getReserveForToken',
        args: [address, parseEther(amount)],
      })
      console.log('read', data)
    } catch (error) {
      console.error('[v2 getBuyTokenAmount Error]', error)
    }
  }

  return {
    nativeBalance: nativeBalance?.value || BigInt(0),
    tokenBalance,
    isFetchingNativeBalance,
    isFetchingTokenBalance,
    refetchNativeBalance,
    refetchTokenBalance,
    getBuyTokenAmount,
  }
}
