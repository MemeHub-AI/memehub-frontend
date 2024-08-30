import dayjs from 'dayjs'
import { useAccount } from 'wagmi'
import { zeroAddress } from 'viem'

import { MemexIdeaItem } from '@/api/memex/types'
import { IdoInfo } from './use-ido-infos'
import { BI_ZERO } from '@/constants/number'

export const useIdeaStatus = (
  idea: MemexIdeaItem | undefined,
  ideaInfo: IdoInfo | undefined
) => {
  const { address } = useAccount()

  const { name, symbol, logo_url, description } = idea ?? {}
  const {
    owner = zeroAddress,
    endTime = BI_ZERO,
    isOver,
    isDeploy,
    overTime = BI_ZERO,
    waitingTime = BI_ZERO,
  } = ideaInfo ?? {}

  const isLikeEnd = dayjs().isAfter(dayjs.unix(Number(endTime)), 'second')
  const waitingEndAt = dayjs
    .unix(Number(overTime))
    .add(Number(waitingTime), 'second')
    .unix()
  const isWaitingEnd = overTime
    ? dayjs().isAfter(waitingEndAt, 'second')
    : false

  const isCreator = owner === address

  const isSuccessLike = isOver
  const isSuccess = isOver && isDeploy

  const isFailedWaiting = isWaitingEnd && !isSuccess
  const isFailed = (isLikeEnd || isFailedWaiting) && !isSuccess

  const isProcessing = !isSuccess && !isFailed
  const hasDetails = !!name && !!symbol && !!logo_url && !!description

  return {
    isCreator,
    isLikeEnd,
    isWaitingEnd,
    isSuccess,
    isSuccessLike,
    isFailed,
    isProcessing,
    hasDetails,
  }
}
