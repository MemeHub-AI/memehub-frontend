import { useTranslation } from 'react-i18next'

import { useStorage } from './use-storage'

export const useLang = () => {
  const { i18n } = useTranslation()
  const { getLang, setLang: set } = useStorage()

  const setLang = (code: string) => {
    i18n.changeLanguage(code)
    set(code)
  }

  const initLang = () => {
    const lang = getLang()
    if (lang) setLang(lang)
  }

  return {
    getLang,
    setLang,
    initLang,
  }
}
