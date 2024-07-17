import { formatEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'

import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from './use-search-params'
import { BI_ZERO } from '@/constants/number'
import { v3TokenAbi } from '@/contract/v3/abi/token'

export const useTradeBalance = () => {
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()

  // Native token balance.
  const {
    data: nativeData,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address,
    chainId,
    query: { refetchInterval: 5_000 },
  })

  // Token balance.
  const {
    data: tokenData,
    isFetching: isFetchingTokenBalance,
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

  const nativeBalance = formatEther(nativeData?.value ?? BI_ZERO)
  const tokenBalance = formatEther(tokenData ?? BI_ZERO)
  const isFetchingBalance = isFetchingNativeBalance || isFetchingTokenBalance

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
