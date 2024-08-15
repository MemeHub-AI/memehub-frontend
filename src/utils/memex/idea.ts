import dayjs from 'dayjs'

import { MemexPostItem, PostStatus } from '@/api/memex/types'
import { useIdeaInfo } from '@/views/memex/hooks/use-idea-info'

export const getIdeaStatus = (
  post: MemexPostItem | undefined,
  info: ReturnType<typeof useIdeaInfo>
) => {
  const { name, symbol, logo_url, description } = post ?? {}

  const isStarted = post?.status === PostStatus.Activated
  const isEnded = dayjs().isAfter(dayjs.unix(info.endAt))
  const isSuccess = info.isOver
  const isDeployed = info.isDeploy

  return {
    hasDetails: !!name && !!symbol && !!logo_url && !!description,
    isStarted,
    isEnded,
    isProcessing: isStarted && !isEnded && !isSuccess,
    isSuccess,
    isFailed: isEnded && !isSuccess,
    isDeployed,
  }
}
