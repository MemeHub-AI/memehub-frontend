import React, { useMemo, type ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {
  RainbowKitProvider,
  lightTheme,
  type Locale,
} from '@rainbow-me/rainbowkit'
import i18n from 'i18next'

import i18nConfig from '@/i18n'
import { wagmiConfig } from '@/config/wagmi'

export const queryClient = new QueryClient()
export const AppProviders = ({ children }: ComponentProps<'div'>) => {
  // const network = WalletAdapterNetwork.Devnet
  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  // const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network])

  return (
    <I18nextProvider i18n={i18nConfig}>
      <WagmiProvider config={wagmiConfig} reconnectOnMount>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            locale={i18n.language as Locale}
            theme={lightTheme({
              accentColor: 'black',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })}
          >
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </I18nextProvider>
  )
}

export default AppProviders
