import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'

import { useLocalStorage } from './use-storage'
import { utilTime } from '@/utils/day'

export const useLang = () => {
  const { i18n } = useTranslation()
  const { getStorage, setStorage } = useLocalStorage()

  const setLang = (code: string) => {
    i18n.changeLanguage(code)
    setStorage('lang', code)
  }

  useEffect(() => {
    const lang = getStorage('lang')
    if (lang) return setLang(lang)
    if (utilTime.isUtcOffset8()) setLang('zh')
  }, [])

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? dayjsZh : dayjsEn)
  }, [i18n.language])

  return {
    getLang: () => getStorage('lang'),
    setLang,
  }
}
