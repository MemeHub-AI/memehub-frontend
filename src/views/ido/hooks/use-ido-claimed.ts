import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { BI_ZERO } from '@/constants/number'
import { useIdoContext } from '@/contexts/ido'
import { idoAbi } from '@/contract/v3/abi/ido'
import { v3Addr } from '@/contract/v3/address'

export const useIdoClaimed = () => {
  const { address } = useAccount()
  const { chainId, poolId } = useIdoContext()

  const { data: tokenAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getClaimTokenAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const { data: reserveAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getClaimEthAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const tokenAmount = formatEther(tokenAmountWei)
  const reserveAmount = formatEther(reserveAmountWei)

  const { data: isClaimedToken } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getIsClaimedToken',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const { data: isClaimedReserve } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getIsClaimedEth',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })

  return {
    tokenAmount,
    reserveAmount,
    isClaimedToken,
    isClaimedReserve,
  }
}
