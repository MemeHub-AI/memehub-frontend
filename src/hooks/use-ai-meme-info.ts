import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useAIMemeInfo = () => {
  const { t } = useTranslation()
  const [isLoadingMemeInfo, setIsLoadingMemeInfo] = useState(false)
  const [isLoadingMemeImg, setIsLoadingMemeImg] = useState(false)

  const getAIMemeInfo = async (
    title: string,
    description: string,
    onLoadedInfo: (data?: AIMemeInfo) => any,
    onLoadedImg: (imgs?: string[]) => any
  ) => {
    try {
      setIsLoadingMemeInfo(true)
      const { data } = await aiApi.getMemeInfo({
        input: title,
      })
      onLoadedInfo(data)
    } catch {
      toast.error(t('creating.meme.info.error'))
    } finally {
      setIsLoadingMemeInfo(false)
    }

    try {
      setIsLoadingMemeImg(true)
      const { data: imgList } = await aiApi.getMemeImage({
        name: title,
        description: description,
      })

      if (imgList?.length) {
        onLoadedImg(imgList)
      }
    } catch {
      toast.error(t('creating.meme.logo.error'))
    } finally {
      setIsLoadingMemeImg(false)
    }
  }

  return {
    isLoadingMemeInfo,
    isLoadingMemeImg,
    getAIMemeInfo,
  }
}
