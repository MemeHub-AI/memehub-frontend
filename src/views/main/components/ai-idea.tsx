import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import Input from '@/components/input'
import { Button } from '@/components/ui/button'
import { abortController } from '@/hooks/use-ai-meme-info'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiStars } from 'react-icons/wi'
import { toast } from 'sonner'

interface Props {
  className?: string
  isLoadingMemeInfo?: boolean
  getAIMemeInfo?: (title: string) => any
}

export const AIIdea = (props: Props) => {
  const { className, isLoadingMemeInfo, getAIMemeInfo } = props
  const { t } = useTranslation()
  const [show, setShow] = useState(isLoadingMemeInfo)
  const [loading, setLoading] = useState(false)
  const [isRandom, setIsRandom] = useState(false)
  const [data, setData] = useState<AIMemeInfo>()
  const [value, setValue] = useState('')

  const onGenerate = async () => {
    if (!value) {
      return toast.error(t('input.you.idea'))
    }

    setShow(true)
    setIsRandom(false)
    setLoading(false)
    setData({
      name: value,
    })
  }

  const onConfirm = async () => {
    if (!isRandom) {
      await getAIMemeInfo?.(value)
    } else {
      await getAIMemeInfo?.('')
    }
    hidden()
  }

  const onRoundGenerate = async () => {
    setShow(true)
    setLoading(false)
    setIsRandom(true)
  }

  const hidden = () => {
    setShow(false)
    setIsRandom(false)

    // abortController.memeImageSign.abort()
    // abortController.memeInfoSign.abort()
    // abortController.memePosterSign.abort()
  }

  return (
    <div
      className={clsx(
        'mt-8 flex items-center bg-slate-100 rounded-sm py-5 px-7 my-5 max-md:w-full max-md:p-3 max-md:flex-col max-md:items-start max-md:mt-2',
        className
      )}
    >
      <div className="flex items-center">
        <img
          src="/images/ai.png"
          alt=""
          className="w-[60px] h-[60px] rounded-sm mr-5"
        />
        <div>{t('ai.generate.bio')}</div>
      </div>
      <div className="flex items-center max-md:mt-4">
        <Input
          placeholder={t('input.you.idea')}
          className="max-w-[180px] ml-4 max-md:ml-0"
          onChange={({ target }) => setValue(target.value)}
          endIcon={
            <div>
              <Button
                size={'icon'}
                className="flex justify-center rounded-none bg-black"
                onClick={onRoundGenerate}
              >
                <WiStars size={26}></WiStars>
              </Button>
            </div>
          }
        ></Input>
        <Button isShadow onClick={onGenerate} className="ml-5">
          {t('ai.generate')}
        </Button>
      </div>
      <AICreateMemecoinDialog
        show={show}
        data={data}
        loading={loading || isLoadingMemeInfo}
        isRandom={isRandom}
        hidden={hidden}
        onConfirm={onConfirm}
      />
    </div>
  )
}
