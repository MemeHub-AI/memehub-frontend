import { type ComponentProps, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTokenQuery } from '@/views/token/hooks/use-token-query'
import { qs } from '@/utils/qs'

export const ChartDexScreener = ({
  className,
  ...props
}: ComponentProps<'iframe'>) => {
  const { i18n } = useTranslation()
  const { chainName, tokenAddr } = useTokenQuery()

  // See: https://dexscreener.com
  const src = useMemo(() => {
    const query = qs.stringify({
      embed: 1,
      theme: 'light',
      trades: 0,
      info: 0,
    })

    return `https://dexscreener.com/${chainName}/${tokenAddr}${query}`
  }, [i18n, chainName, tokenAddr])

  return <iframe src={src} className={className} {...props}></iframe>
}

export default ChartDexScreener
