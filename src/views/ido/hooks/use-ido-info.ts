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

const poolId = BigInt(0) // TODO: temp

export const useIdoInfo = (chainId = 0) => {
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
    args: [poolId, address!],
    query: { enabled: !!ido && !!address },
  })
  const [deposit = BI_ZERO, weight = BI_ZERO] = userInfo
  const userAmount = formatEther(deposit)
  const userWeight = weight.toString()

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    refetch: refetchPools,
  } = useReadContract({
    abi: idoAbi,
    address: ido,
    chainId,
    functionName: 'pools',
    args: [poolId],
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
  // userQuota = deposit / weightSum * 100
  const userQuota = BigNumber(userAmount)
    .multipliedBy(weight.toString())
    .div(weightSum.toString())
    .multipliedBy(100)
    .toFixed()
  const currentReserveAmount = formatEther(ethBalance)
  const totalReserveAmount = formatEther(totalEthAmount)
  const idoProgress = BigNumber(currentReserveAmount)
    .div(totalReserveAmount)
    .multipliedBy(100)
    .toFixed()
  const progress = BigNumber(idoProgress).isNaN() ? 0 : idoProgress

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
  }
}
