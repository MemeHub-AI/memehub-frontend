import dayjs from 'dayjs'

import { MemexIdeaItem, IdeaStatus } from '@/api/memex/types'
import { useIdeaInfo } from '@/views/memex/hooks/use-idea-info'

// TODO: refactor to a hook.
export const getIdeaStatus = (
  post: MemexIdeaItem | undefined,
  info: ReturnType<typeof useIdeaInfo>
) => {
  const { name, symbol, logo_url, description } = post ?? {}

  const isStarted = post?.status === IdeaStatus.Activated
  const isEnded = dayjs().isAfter(dayjs.unix(info.endAt))
  const isDeployed = info.isDeploy
  const isSuccess = info.isOver // TODO: should `&& isDeployed`

  return {
    hasDetails: !!name && !!symbol && !!logo_url && !!description,
    isStarted,
    isEnded,
    isProcessing: isStarted && !isEnded && !isSuccess,
    isSuccess,
    isFailed: isEnded && !isSuccess && !isDeployed,
    isDeployed,
  }
}
