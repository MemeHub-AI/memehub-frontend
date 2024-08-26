import { formatEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { tokenAbiMap } from '@/contract/abi/token'
import { useTokenContext } from '@/contexts/token'

export const useTradeBalance = () => {
  const { address } = useAccount()
  const {
    chainId,
    tokenAddr,
    tokenInfo: { coin_version } = {},
  } = useTokenContext()

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
    abi: tokenAbiMap[coin_version!],
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
