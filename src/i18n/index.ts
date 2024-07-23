import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import ZH from './locales/zh.json'
import EN from './locales/en.json'

export const resources: Resource = {
  en: {
    name: 'English',
    translation: EN,
    iso31661: 'en',
  },
  zh: {
    translation: ZH,
    name: '中文',
    iso31661: 'cn',
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
