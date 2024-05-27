import { t } from 'i18next'
import React from 'react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { AIMemeInfo } from '@/api/ai/type'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'

interface Props {
  show?: boolean
  hidden?: () => void
  loading?: boolean
  isRandom?: boolean
  data?: AIMemeInfo
  onConfirm: () => any
}

export const AICreateMemecoinDialog = (props: Props) => {
  const { show, hidden, loading, isRandom, data, onConfirm } = props

  const { push, pathname } = useRouter()

  const confirm = () => {
    if (!pathname.startsWith(Routes.Create)) {
      const aimemeInfoStore = useAimemeInfoStore.getState()
      aimemeInfoStore.setInfo({
        name: data?.name,
        image: data?.image,
        description: data?.description,
      })
      return push(Routes.Create)
    }
    onConfirm()
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
              <img
                src={data?.image}
                alt={data?.name}
                className="w-[150px] h-[150px] mx-auto my-4 rounded-md"
              />
            </div>
          ) : null}
          <div className="flex gap-10 mt-6 w-max mx-auto">
            <Button
              size="lg"
              isShadow
              frontBgc="!bg-black"
              backBgc="!bg-white"
              frontTextColor="!text-white"
              onClick={confirm}
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

  if (!data?.name && !isRandom && !loading) {
    return <></>
  }
  return (
    <Dialog open={show} onOpenChange={hidden}>
      {handleDialogContent()}
    </Dialog>
  )
}
