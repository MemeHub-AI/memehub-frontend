import Head from 'next/head'
import Script from 'next/script'
import { Buffer } from 'buffer'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-photo-view/dist/react-photo-view.css'

import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/layouts/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  ;(global as any).Buffer = Buffer

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <title>Memehub</title>
        <meta
          name="keywords"
          content="meme, memehub, memecoin, crypto, web3, blockchain"
        />
        <meta
          name="description"
          content="Memehub is a unique memecoin launch platform driven by AI."
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
        <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
      </AppProviders>
    </>
  )
}
