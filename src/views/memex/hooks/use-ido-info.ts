import { Address, formatEther, zeroAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'

import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { BI_ZERO } from '@/constants/number'

export const useIdoInfo = (addr: string | null | undefined) => {
  const { chainId = 0 } = useAccount()

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
    refetch: refetchInfo,
  } = useReadContract({
    abi: memexIdoAbi,
    address: addr as Address,
    chainId,
    functionName: 'getProjectInfo',
    query: {
      enabled: !!addr && !!chainId,
    },
  })
  const likeValue = formatEther(ETHAmountOfLike)
  const ownerPercent = BigNumber(ownerRatio.toString()).div(100)
  const userPercent = BigNumber(userRatio.toString()).div(100)
  const durationHours = dayjs
    .unix(Number(endTime))
    .diff(dayjs.unix(Number(startTime)), 'hours')

  return {
    isLoadingInfo,
    refetchInfo,
    owner,
    tokenAddr: token,
    likeCount: likeCount.toString(),
    maxLikeCount: maxCount.toString(),
    likeValue,
    ownerPercent,
    userPercent,
    durationHours,
  }
}
