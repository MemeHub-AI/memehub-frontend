import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { BI_ZERO } from '@/constants/number'
import { idoAbi } from '@/contract/v3/abi/ido'
import { v3Addr } from '@/contract/v3/address'

export const useIdoClaimed = (chainId: number, poolId: number) => {
  const { address } = useAccount()

  const { data: tokenAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    chainId,
    functionName: 'getClaimTokenAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const { data: reserveAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    chainId,
    functionName: 'getClaimEthAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const tokenAmount = formatEther(tokenAmountWei)
  const reserveAmount = formatEther(reserveAmountWei)

  const {
    data: isClaimedToken,
    isLoading: isLoadingClaimedToken,
    refetch: refetchClaimedToken,
  } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    chainId,
    functionName: 'getIsClaimedToken',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const {
    data: isClaimedReserve,
    isLoading: isLoadingClaimedReserve,
    refetch: refetchClaimedReserve,
  } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    chainId,
    functionName: 'getIsClaimedEth',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })

  return {
    tokenAmount,
    reserveAmount,
    isClaimedToken,
    isClaimedReserve,
    isLoadingClaimedToken,
    isLoadingClaimedReserve,
    refetchClaimedToken,
    refetchClaimedReserve,
  }
}
