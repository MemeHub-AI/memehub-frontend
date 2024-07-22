import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { BI_ZERO } from '@/constants/number'
import { idoAbi } from '@/contract/v3/abi/ido'
import { v3Addr } from '@/contract/v3/address'

export enum IdoStatus {
  Active,
  Ended,
  Canceled,
}

export const useIdoInfo = (chainId = 0, poolId = 0) => {
  const { address } = useAccount()
  const { ido } = v3Addr[chainId] ?? {}

  const {
    data: userInfo = [],
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useReadContract({
    abi: idoAbi,
    address: ido,
    chainId,
    functionName: 'getUserInfo',
    args: [BigInt(poolId), address!],
    query: { enabled: !!ido && !!address },
  })
  const [deposit = BI_ZERO, weight = BI_ZERO] = userInfo
  const userAmount = formatEther(deposit)

  const { data: initUserWeight = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getUserWeight',
    args: [address!, [], BigInt(0)],
    query: { enabled: !!address },
  })
  const userWeight = BigNumber(deposit.toString()).isZero()
    ? initUserWeight.toString()
    : weight.toString()

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    refetch: refetchPools,
  } = useReadContract({
    abi: idoAbi,
    address: ido,
    chainId,
    functionName: 'pools',
    args: [BigInt(poolId)],
    query: { refetchInterval: 10_000 },
  })
  const [
    tokenAddress,
    tokenAmount,
    status,
    startAt = 0,
    endAt = 0,
    perUserLimit = BI_ZERO,
    ethBalance = BI_ZERO,
    totalEthAmount = BI_ZERO,
    weightSum = BI_ZERO,
  ] = pools
  const isActive = status === IdoStatus.Active
  const isEnded = status === IdoStatus.Ended
  const isCanceled = status === IdoStatus.Canceled
  const totalWeight = formatEther(weightSum)
  // userQuota = deposit * weight / weightSum
  const userQuota = BigNumber(userAmount)
    .multipliedBy(userWeight)
    .div(totalWeight)
    .toFixed()
  const currentReserveAmount = formatEther(ethBalance)
  const totalReserveAmount = formatEther(totalEthAmount)
  const idoProgress = BigNumber(currentReserveAmount)
    .div(totalReserveAmount)
    .multipliedBy(100)
    .toFixed(2)
  const progress = BigNumber(idoProgress).isNaN() ? 0 : idoProgress
  const userMax = formatEther(perUserLimit)
  const userRemain = BigNumber(userMax).minus(formatEther(deposit)).toFixed()

  const refetchIdoInfo = () => {
    refetchUserInfo()
    refetchPools()
  }

  return {
    isLoadingUserInfo,
    isLoadingPools,
    refetchIdoInfo,
    tokenAddress,
    tokenAmount,
    status,
    isActive,
    isEnded,
    isCanceled,
    startAt,
    endAt,
    userAmount,
    userWeight,
    userQuota,
    currentReserveAmount,
    totalReserveAmount,
    progress,
    userMax,
    userRemain,
  }
}
