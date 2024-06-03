import Head from 'next/head'
import { useTranslation } from 'react-i18next'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AppLayout } from '@/components/layouts/app'
import { AppProviders } from '@/components/app-providers'

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
      <AppProviders>
        <AppLayout children={<Component {...pageProps} />} />
      </AppProviders>
    </>
  )
}
