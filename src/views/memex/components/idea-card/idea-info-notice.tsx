import React from 'react'
import { BsLightningFill } from 'react-icons/bs'

import { Countdown } from '@/components/countdown'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { useTranslation } from 'react-i18next'

export const ideaInfoNotice = () => {
  const { t } = useTranslation()
  const { ideaInfo, ideaStatus, refetchInfo } = useIdeaCardContext()
  const { overTime, waitingTime } = ideaInfo ?? {}
  const { isProcessing, hasDetails, isCreator, isSuccessLike } = ideaStatus
  const canShowSuccessTips = isSuccessLike && !hasDetails && isProcessing

  return (
    <div>
      {/* <div className="flex space-x-2 border border-yellow-600 rounded mt-2 p-2 text-yellow-600 w-full">
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

          <p>{t('memex.done-desc3')}</p>
          <p>{t('memex.done-desc4')}</p>
        </div>
      </div> */}

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
    </div>
  )
}

export default ideaInfoNotice
