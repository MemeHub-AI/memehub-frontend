import Head from 'next/head'
import { useTranslation } from 'react-i18next'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AppLayout } from '@/components/layouts/app'
import { AppProviders } from '@/components/app-providers'
import Script from 'next/script'
import { useRewardCode } from '@/hooks/use-reward-code'
import { useStorage } from '@/hooks/use-storage'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { qs } from '@/hooks/use-fetch'

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation()
  const { getInviteCode, setInviteCode } = useStorage()
  const { query, ...router } = useRouter()

  const handleRouteChange = (url: string) => {
    const code = getInviteCode()

    if (code && !/(\?|&)r=/.test(location.search)) {
      const url = new URL(location.origin + location.pathname)
      const query = qs.parse(location.search)
      Object.keys(query).forEach((key) => {
        url.searchParams.set(key, query[key])
      })
      url.searchParams.set('r', code)
      router.replace(url.toString(), undefined, { shallow: true })
    }
    router.events.off('routeChangeComplete', handleRouteChange)
  }

  useEffect(() => {
    const inviteCode = location.search.match(/r=([^&]+)*/)?.[1] ?? ''

    setInviteCode(inviteCode)
    router.events.on('routeChangeStart', () => {
      router.events.on('routeChangeComplete', handleRouteChange)
    })
  }, [])

  return (
    <>
      <Head>
        <title>{t('meme-hub')}</title>
        <meta
          name="keywords"
          content="meme, meme hub, meme launchpad, meme coin, crypto, web3, blockchain"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
      ></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `,
        }}
      ></Script>
      <AppProviders>
        <AppLayout children={<Component {...pageProps} />} />
      </AppProviders>
    </>
  )
}
