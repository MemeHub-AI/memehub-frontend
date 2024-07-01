import { formatEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'

import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'
import { useTradeSearchParams } from './use-search-params'

export const useTradeInfo = () => {
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { tokenConfig } = getV3Config(chainId)

  const {
    data: nativeData,
    isFetching: isFetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address,
    chainId,
    query: { refetchInterval: 5_000 },
  })
  const {
    data: tokenData,
    isFetching: isFetchingTokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    ...tokenConfig!,
    address: tokenAddr,
    functionName: 'balanceOf',
    chainId,
    args: [address!],
    query: {
      enabled: !!address && !!tokenConfig,
      refetchInterval: 5_000,
    },
  })
  const nativeBalance = formatEther(nativeData?.value ?? BigInt(0))
  const tokenBalance = formatEther(tokenData ?? BigInt(0))
  const isFetchingBalance = isFetchingNativeBalance || isFetchingTokenBalance

  return {
    nativeBalance,
    tokenBalance,
    isFetchingNativeBalance,
    isFetchingTokenBalance,
    isFetchingBalance,
    refetchNativeBalance,
    refetchTokenBalance,
  }
}
