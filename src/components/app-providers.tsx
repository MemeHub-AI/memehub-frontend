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
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import i18n from 'i18next'

import i18nConfig from '@/i18n'
import { wagmiConfig } from '@/config/wagmi'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

export const queryClient = new QueryClient()

export const AppProviders = ({ children }: ComponentProps<'div'>) => {
  const localUrl = typeof location !== 'undefined' ? location.origin : ''
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
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
                <WalletProvider wallets={wallets} autoConnect>
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
