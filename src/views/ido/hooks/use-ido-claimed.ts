import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { BI_ZERO } from '@/constants/number'
import { idoAbi } from '@/contract/abi/ido/ido'
import { addrMap } from '@/contract/address'

export const useIdoClaimed = (chainId: number, poolId: number) => {
  const { address } = useAccount()
  const { ido } = addrMap[chainId] ?? {}
  const query = { enabled: !!address && !!ido }

  const { data: tokenAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getClaimTokenAmount',
    args: [BigInt(poolId), address!],
    query,
  })
  const { data: reserveAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getClaimEthAmount',
    args: [BigInt(poolId), address!],
    query,
  })
  const tokenAmount = formatEther(tokenAmountWei)
  const reserveAmount = formatEther(reserveAmountWei)

  const {
    data: isClaimedToken,
    isLoading: isLoadingClaimedToken,
    refetch: refetchClaimedToken,
  } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getIsClaimedToken',
    args: [BigInt(poolId), address!],
    query,
  })
  const {
    data: isClaimedReserve,
    isLoading: isLoadingClaimedReserve,
    refetch: refetchClaimedReserve,
  } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getIsClaimedEth',
    args: [BigInt(poolId), address!],
    query,
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
