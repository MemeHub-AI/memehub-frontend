import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsLightningFill } from 'react-icons/bs'

import { Countdown } from '@/components/countdown'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'

export const IdeaStatusCountdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { idea, ideaInfo, ideaStatus, isList, startAt, duration, refetchInfo } =
    useIdeaCardContext()
  const { overTime, waitingTime } = ideaInfo ?? {}
  const { isProcessing, hasDetails, isCreator, isSuccessLike } = ideaStatus

  const canCountdown = isList && isProcessing && !isSuccessLike
  const canEditCoinDetails = !hasDetails && isCreator && isProcessing
  const canShowSuccessTips = isSuccessLike && !hasDetails && isProcessing

  return (
    <>
      {canCountdown && (
        <Countdown
          className="text-sm text-green-700"
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
          className="py-3 mt-2"
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

      {canShowSuccessTips && (
        <div className="flex space-x-2 border border-yellow-600 rounded mt-2 p-2 text-yellow-600 w-full">
          <BsLightningFill className="shrink-0" size={22} />
          <div className="text-sm font-bold w-full">
            <div className="leading-none flex flex-1 justify-between">
              <span>{t('memex.done-desc1')}</span>
              <Countdown
                className="text-green-600 self-end"
                createdAt={Number(overTime)}
                duration={Number(waitingTime)}
                onExpired={refetchInfo}
              />
            </div>

            {isCreator ? (
              <p>{t('memex.done-desc2')}</p>
            ) : (
              <p>{t('memex.done-desc3')}</p>
            )}
            <p>{t('memex.done-desc4')}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default IdeaStatusCountdown
