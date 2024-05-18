import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AppLayout } from '@/components/layouts/app'
import { AppProviders } from '@/components/app-providers'
import { useMounted } from '@/hooks/use-mounted'
import { useLang } from '@/hooks/use-lang'
import { Toaster } from '@/components/ui/sonner'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export default function App({ Component, pageProps }: AppProps) {
  const { isNotMounted } = useMounted(onMounted)
  const { t } = useTranslation()
  const { initLang } = useLang()

  function onMounted() {
    initLang()
  }

  if (isNotMounted) return <></>

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
        <AppLayout>
          <Component {...pageProps} />
          <Toaster />
        </AppLayout>
      </AppProviders>
    </>
  )
}
