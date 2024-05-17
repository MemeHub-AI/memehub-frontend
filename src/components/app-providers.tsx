import React, { type ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import i18nConfig from '@/i18n'
import { wagmiConfig } from '@/config/wagmi'

const queryClient = new QueryClient()

export const AppProviders = ({ children }: ComponentProps<'div'>) => {
  return (
    <I18nextProvider i18n={i18nConfig}>
      <WagmiProvider config={wagmiConfig} reconnectOnMount>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </I18nextProvider>
  )
}

export default AppProviders
