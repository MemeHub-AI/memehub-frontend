import { Address, formatEther, zeroAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'

import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { BI_ZERO } from '@/constants/number'

export const useIdeaInfo = (addr: string | null | undefined) => {
  const { chainId = 0, address } = useAccount()
  const idoConfig = {
    abi: memexIdoAbi,
    address: addr as Address,
    chainId,
  }

  const { data: isLiked = false, refetch: refetchIsLiked } = useReadContract({
    ...idoConfig,
    functionName: 'isLike',
    args: [address!],
  })

  const {
    data: {
      owner = zeroAddress,
      token = zeroAddress,
      likeCount = BI_ZERO,
      maxCount = BI_ZERO,
      ETHAmountOfLike = BI_ZERO,
      ownerRatio = BI_ZERO,
      userRatio = BI_ZERO,
      alreadyClaimCount = BI_ZERO,
      startTime = BI_ZERO,
      endTime = BI_ZERO,
      isOver = false,
      isDeploy = false,
    } = {},
    isLoading: isLoadingInfo,
    refetch,
  } = useReadContract({
    ...idoConfig,
    functionName: 'getProjectInfo',
    query: {
      enabled: !!addr && !!chainId,
      refetchInterval: 5_000,
    },
  })
  const likeValue = formatEther(ETHAmountOfLike)
  const likedCount = likeCount.toString()
  const maxLikeCount = maxCount.toString()
  const progress = BigNumber(likedCount).isZero()
    ? '0'
    : BigNumber(likedCount).div(maxLikeCount).multipliedBy(100).toFixed()

  const claimedCount = alreadyClaimCount.toString()
  const ownerPercent = BigNumber(ownerRatio.toString()).div(100).toFixed()
  const userPercent = BigNumber(userRatio.toString()).div(100).toFixed()

  const startAt = Number(startTime)
  const endAt = Number(endTime)
  const durationSeconds = dayjs.unix(endAt).diff(dayjs.unix(startAt), 'seconds')

  const refetchInfo = () => {
    refetchIsLiked()
    refetch()
  }

  return {
    isLoadingInfo,
    refetchInfo,

    owner,
    tokenAddr: token,

    likeValue,
    likedCount,
    maxLikeCount,
    progress,
    claimedCount,

    ownerPercent,
    userPercent,

    startAt,
    endAt,
    durationSeconds,

    isOver,
    isDeploy,
    isLiked,
  }
}
