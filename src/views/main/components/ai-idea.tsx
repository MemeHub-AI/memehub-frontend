import { tokenApi } from '@/api/token'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import Input from '@/components/input'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiStars } from 'react-icons/wi'

export const AIIdea = () => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRandom, setIsRandom] = useState(false)
  const [data, setData] = useState<any>()

  const onGenerate = async () => {
    setShow(true)
    setLoading(true)
    const { data } = await tokenApi.generateInfo()
    setLoading(false)
    setData(data)
  }

  const onRoundGenerate = async () => {
    setShow(true)
    setLoading(true)
    setIsRandom(true)
    const { data } = await tokenApi.generateInfo()
    setLoading(false)
    setData(data)
  }

  const hidden = () => {
    setShow(false)
    setIsRandom(false)
  }

  return (
    <div className="mt-8 flex items-center bg-slate-100 rounded-sm p-5 my-5 max-sm:p-3 max-sm:flex-col max-sm:mt-2">
      <div className="flex items-center">
        <img
          src="https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/pepe-ad9f3a5d0ceb9ca1c171603bb53d9708.avif"
          alt=""
          className="w-[70px] h-[70px] rounded-sm mr-4"
        />
        <div>{t('ai.generate.bio')}</div>
      </div>
      <div className="flex items-center max-sm:mt-4">
        <Input
          placeholder={t('input.you.idea')}
          className="max-w-[180px] ml-4 max-sm:ml-0"
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
