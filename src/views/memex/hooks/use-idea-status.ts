import dayjs from 'dayjs'

import { IdeaStatus, MemexIdeaItem } from '@/api/memex/types'
import { IdoInfo } from './use-ido-infos'
import { BI_ZERO } from '@/constants/number'

export const useIdeaStatus = (
  idea: MemexIdeaItem | undefined,
  ideaInfo: IdoInfo | undefined
) => {
  const { name, symbol, logo_url, description } = idea ?? {}
  const { endTime = BI_ZERO } = ideaInfo ?? {}

  const isStarted = idea?.status === IdeaStatus.Activated
  const isEnded = dayjs().isAfter(dayjs.unix(Number(endTime)))
  const isDeployed = ideaInfo?.isDeploy
  const isSuccess = ideaInfo?.isOver // TODO: should `&& isDeployed`

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
