import React, { useMemo, type ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {
  RainbowKitProvider,
  lightTheme,
  type Locale,
} from '@rainbow-me/rainbowkit'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import i18n from 'i18next'

import i18nConfig from '@/i18n'
import { wagmiConfig } from '@/config/wagmi'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { solanaDevNet, solanaWallets } from '@/config/wallets'

export const queryClient = new QueryClient()

export const AppProviders = ({ children }: ComponentProps<'div'>) => {
  const localUrl = typeof location !== 'undefined' ? location.origin : ''

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(solanaDevNet), [solanaDevNet])

  const solanaWalletsConfig = useMemo(
    () => solanaWallets,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <I18nextProvider i18n={i18nConfig}>
      <WagmiProvider config={wagmiConfig} reconnectOnMount>
        <TonConnectUIProvider
          manifestUrl={`${localUrl}/tonconnect-manifest.json`}
        >
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
              <ConnectionProvider endpoint={endpoint}>
                <WalletProvider
                  wallets={solanaWalletsConfig}
                  // autoConnect
                  localStorageKey="solana-wallet-key"
                >
                  <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
              </ConnectionProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </TonConnectUIProvider>
      </WagmiProvider>
    </I18nextProvider>
  )
}

export default AppProviders
