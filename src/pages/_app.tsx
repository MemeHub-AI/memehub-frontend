import type { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AppLayout } from '@/components/layouts/app'
import { AppProviders } from '@/components/app-providers'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <AppProviders>
        <Component {...pageProps} />
      </AppProviders>
    </AppLayout>
  )
}
