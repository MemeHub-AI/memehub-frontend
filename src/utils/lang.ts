import i18n from 'i18next'

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
  isEn: () => i18n.language === 'en',
  isZh: () => i18n.language === 'zh',
  replace: (value: string, args: (string | number)[], symbol = '{}') => {
    let i = 0
    return value.replace(new RegExp(symbol, 'g'), () => String(args[i++]))
  },
  locale: (localeObj: Record<string, any> | undefined) => {
    if (!localeObj) return ''
    return localeObj[i18n.language] || localeObj.en
  },
}
