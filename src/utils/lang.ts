import i18n from 'i18next'

export const utilLang = {
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
