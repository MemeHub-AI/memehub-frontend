import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'

import { Countdown } from '@/components/countdown'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'

export const IdeaStatusCountdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { idea, ideaStatus, isList, startAt, duration, refetchInfo } =
    useIdeaCardContext()
  // const { overTime, waitingTime } = ideaInfo ?? {}
  const { isProcessing, hasDetails, isCreator, isSuccessLike } = ideaStatus

  const canCountdown = isProcessing && !isSuccessLike
  const canEditCoinDetails = !hasDetails && isCreator && isProcessing

  return (
    <>
      <div className="flex space-x-2 items-center">
        {canCountdown && (
          <Countdown
            className="text-sm text-green-600/90"
            createdAt={startAt}
            duration={duration}
            onExpired={refetchInfo}
          />
        )}
        {canEditCoinDetails && (
          <Button
            variant="yellow"
            shadow="none"
            size="xs"
            className="py-3"
            onClick={(e) => {
              e.stopPropagation()
              router.push({
                pathname: Routes.MemexCreateDetails,
                query: { hash: idea?.hash, chian: idea?.chain },
              })
            }}
          >
            <AiOutlineEdit size={16} className="mr-0.5" />
            {t('coin-detail')}
          </Button>
        )}
      </div>
    </>
  )
}

export default IdeaStatusCountdown
