import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'

import { useStorage } from './use-storage'
import { utilTime } from '@/utils/time'

export const useLang = () => {
  const { i18n } = useTranslation()
  const { getLang, setLang: set } = useStorage()

  const setLang = (code: string) => {
    i18n.changeLanguage(code)
    set(code)
  }

  useEffect(() => {
    const lang = getLang()
    if (lang) return setLang(lang)
    if (utilTime.isUtcOffset8()) setLang('zh')
  }, [])

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? dayjsZh : dayjsEn)
  }, [i18n.language])

  return {
    getLang,
    setLang,
  }
}
