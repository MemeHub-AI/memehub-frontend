export const enum URL_TYPE {
  TWITTER = 'https://x.com/',
  TELEGRAM = 'https://t.me/',
  WEBSITE = 'https://',
}

export const utilsUrl = {
  mediaUrl: (value: string = '', type: URL_TYPE) => {
    if (value) {
      if (value.startsWith('@')) {
        value = value.replace('@', '')
      }
      return /^(https|http):\/\//.test(value) ? value : `${type}${value}`
    }
    return value
  },
}
