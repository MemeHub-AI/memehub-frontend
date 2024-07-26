import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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

  return {
    getLang,
    setLang,
  }
}
