import { t } from 'i18next'
import React from 'react'

import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { AIMemeInfo } from '@/api/ai/type'
import { Img } from '@/components/img'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { useCheckAccount } from '@/hooks/use-check-chain'

interface Props {
  show: boolean
  isRandom?: boolean
  data?: AIMemeInfo
  onCancel: () => void
  onConfirm: () => void
}

export const AICreateMemecoinDialog = (props: Props) => {
  const { show, isRandom, data, onConfirm, onCancel } = props
  const { playGuaGua } = useAudioPlayer()
  const { checkForConnect } = useCheckAccount()

  const handleConfirm = () => {
    if (!checkForConnect()) {
      onCancel()
      return
    }

    playGuaGua()
    onConfirm()
  }

  const handleDialogContent = () => {
    return (
      <React.Fragment>
        <div className="mt-4 mx-auto max-sm:w-full">
          {isRandom ? (
            <div className="w-max max-w-[380px] max-sm:max-w-full">
              <h1 className="text-xl text-wrap">
                {t('create.random.memecoin.with.ai')}
              </h1>
              <h1 className="text-xl text-wrap">
                {t('create,random.memecoin.with.ai.1').replace(
                  '$1',
                  data?.name!
                )}
              </h1>
            </div>
          ) : (
            <>
              <h1 className="text-xl">{t('create.memecoin.with.ai')}</h1>
              <h1 className="text-xl">
                {t('create.memecoin.with.ai.1').replace('$1', data?.name!)}
              </h1>
            </>
          )}
        </div>
        {data?.image ? (
          <div>
            <Img
              src={data.image}
              alt={data.name}
              className="w-[150px] h-[150px] object-cover mx-auto my-4 rounded-md"
            />
          </div>
        ) : null}
        <div className="flex space-x-10 mt-6 w-max mx-auto max-sm:mt-0">
          <Button variant="default" size="lg" onClick={handleConfirm}>
            {t('coinfirm')}
          </Button>
          <Button size="lg" onClick={onCancel}>
            {t('cancel')}
          </Button>
        </div>
      </React.Fragment>
    )
  }

  return (
    <Dialog open={show} onOpenChange={onCancel}>
      {handleDialogContent()}
    </Dialog>
  )
}
