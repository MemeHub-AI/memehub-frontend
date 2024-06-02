import i18next from 'i18next'

import { useStorage } from '@/hooks/use-storage'

export const utilLang = {
  getContent(content: any) {
    if (content == null) return ''
    if (typeof content === 'string') return content
    if (Array.isArray(content)) return ''

    const lang = useStorage().getLang() ?? 'en'

    if (content[lang!]) {
      return content[lang!]
    }

    for (let key in content) {
      if (content[key]) {
        return content[key]
      }
    }

    return ''
  },
  isEn: (i18n = i18next) => i18n.language === 'en',
}
