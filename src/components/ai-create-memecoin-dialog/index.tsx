import { t } from 'i18next'
import React from 'react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { AIMemeInfo } from '@/api/ai/type'

interface Props {
  show?: boolean
  hidden?: () => void
  loading?: boolean
  isRandom?: boolean
  data?: AIMemeInfo
}

export const AICreateMemecoinDialog = (props: Props) => {
  const { show, hidden, loading, isRandom, data } = props

  const { push } = useRouter()

  const onConfirm = () => {
    push(Routes.Create)
  }

  const handleDialogContent = () => {
    if (loading) {
      return (
        <React.Fragment>
          <div className="mt-4 text-center">
            <h1 className="text-xl text-center">{t('ai.creating')}</h1>
            <h1 className="text-xl text-center">{t('wait')}</h1>
          </div>
          <div>
            <img
              src="/images/ai-loding.webp"
              alt="BabyPEPE"
              className="w-[95%] object-cover mx-auto my-4 rounded-md"
            />
          </div>
        </React.Fragment>
      )
    }

    if (show) {
      return (
        <React.Fragment>
          <div className="w-max mt-4 mx-auto max-sm:w-full">
            {isRandom ? (
              <div className="max-w-[380px] max-sm:max-w-full">
                <h1 className="text-xl">
                  {t('create.random.memecoin.with.ai')}
                </h1>
                <h1 className="text-xl">
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
          <div>
            <img
              src={data?.image}
              alt="BabyPEPE"
              className="w-[150px] h-[150px] mx-auto my-4 rounded-md"
            />
          </div>
          <div className="flex gap-10 mt-6 w-max mx-auto">
            <Button
              size="lg"
              isShadow
              frontBgc="!bg-black"
              backBgc="!bg-white"
              frontTextColor="!text-white"
              onClick={onConfirm}
            >
              {t('coinfirm')}
            </Button>
            <Button isShadow variant="outline" size="lg" onClick={hidden}>
              {t('cancel')}
            </Button>
          </div>
        </React.Fragment>
      )
    }
  }

  return (
    <Dialog open={show} onOpenChange={hidden}>
      {handleDialogContent()}
    </Dialog>
  )
}
