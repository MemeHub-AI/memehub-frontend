import { formatEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'

import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from './use-search-params'
import { BI_ZERO } from '@/constants/number'
import { v3TokenAbi } from '@/contract/v1/abi/token'

export const useTradeBalance = () => {
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()

  // Reserve token balance.
  const {
    data: { value = BI_ZERO } = {},
    isFetching: isFetchingReserve,
    refetch: refetchNativeBalance,
  } = useBalance({
    address,
    chainId,
    query: { refetchInterval: 5_000 },
  })

  // Token balance.
  const {
    data: tokenData = BI_ZERO,
    isFetching: isFetchingToken,
    refetch: refetchTokenBalance,
  } = useReadContract({
    abi: v3TokenAbi,
    address: tokenAddr,
    functionName: 'balanceOf',
    chainId,
    args: [address!],
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
    },
  })

  const nativeBalance = formatEther(value)
  const tokenBalance = formatEther(tokenData)
  const isFetchingBalance = isFetchingReserve || isFetchingToken

  const refetchBalance = () => {
    refetchNativeBalance()
    refetchTokenBalance()
  }

  return {
    nativeBalance,
    tokenBalance,
    isFetchingBalance,
    refetchBalance,
  }
}
