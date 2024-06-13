import Head from 'next/head'
import { useTranslation } from 'react-i18next'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AppLayout } from '@/components/layouts/app'
import { AppProviders } from '@/components/app-providers'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation()

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
