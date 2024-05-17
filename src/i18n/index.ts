import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import ZH from './locales/zh.json'
import EN from './locales/en.json'

export const resources: Resource = {
  zh: {
    translation: ZH,
    name: '中文',
  },
  en: {
    name: 'English',
    translation: EN,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
