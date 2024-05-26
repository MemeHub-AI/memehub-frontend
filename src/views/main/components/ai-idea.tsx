import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import Input from '@/components/input'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiStars } from 'react-icons/wi'
import { toast } from 'sonner'

export const AIIdea = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRandom, setIsRandom] = useState(false)
  const [data, setData] = useState<AIMemeInfo>()

  const onGenerate = async () => {
    setShow(true)
    setLoading(true)
    const { data } = await aiApi.getMemeInfo()
    setLoading(false)
    setData(data!)
  }

  const onRoundGenerate = async () => {
    setShow(true)
    setLoading(true)
    setIsRandom(true)
    try {
      toast.loading(t('creating.meme.info'))
      const { data } = await aiApi.getMemeInfo()
      const { data: memeImage } = await aiApi.getMemeImage(data)
      data!.image = memeImage?.[0]
      setData(data!)
    } catch (e) {
      toast.error(t('creating.meme.info.error'))
      setShow(false)
    } finally {
      setLoading(false)
      toast.dismiss()
    }
  }

  const hidden = () => {
    setShow(false)
    setIsRandom(false)
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
          endIcon={
            <div>
              <Button
                size={'icon'}
                className="flex justify-center rounded-none bg-black"
                onClick={onGenerate}
              >
                <WiStars size={26}></WiStars>
              </Button>
            </div>
          }
        ></Input>
        <Button isShadow onClick={onRoundGenerate} className="ml-5">
          {t('ai.generate')}
        </Button>
      </div>
      <AICreateMemecoinDialog
        data={data}
        hidden={hidden}
        isRandom={isRandom}
        loading={loading}
        show={show}
      />
    </div>
  )
}
