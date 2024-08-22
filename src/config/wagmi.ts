import { http, fallback, unstable_connector } from 'wagmi'
import { injected } from 'wagmi/connectors'
import {
  mainnet,
  bsc,
  opBNB,
  scroll,
  base,
  blast,
  fantom,
  zkSync,

  // testnet
  sepolia,
  bscTestnet,
  opBNBTestnet,
  scrollSepolia,
  baseSepolia,
  blastSepolia,
  fantomTestnet,
  zkSyncSepoliaTestnet,
} from 'wagmi/chains'
import { dotenv } from '@/utils/env'
import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit'

const dev = {
  chains: [
    sepolia,
    bscTestnet,
    opBNBTestnet,
    scrollSepolia,
    baseSepolia,
    blastSepolia,
    fantomTestnet,
    zkSyncSepoliaTestnet,
  ],
  transports: {
    [sepolia.id]: fallback([unstable_connector(injected), http()]),
    [bscTestnet.id]: fallback([
      http(
        'https://polished-old-valley.bsc-testnet.quiknode.pro/af2b2e4daee6f862aaff645c537377f3d4605d79/'
      ),
      unstable_connector(injected),
      http(),
    ]),
    [opBNBTestnet.id]: fallback([unstable_connector(injected), http()]),
    [scrollSepolia.id]: fallback([unstable_connector(injected), http()]),
    [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    [blastSepolia.id]: fallback([unstable_connector(injected), http()]),
    [fantomTestnet.id]: fallback([unstable_connector(injected), http()]),
    [zkSyncSepoliaTestnet.id]: fallback([unstable_connector(injected), http()]),
  },
}

const { wallets } = getDefaultWallets()

export const wagmiConfig = getDefaultConfig({
  appName: 'Memehub',
  projectId: '72584dc758deda964e371db486be5a0c',
  ssr: true,
  wallets,
  chains: [
    mainnet,
    bsc,
    base,
    blast,
    opBNB,
    scroll,
    fantom,
    zkSync,

    // testnet
    ...(dotenv.isDev ? dev.chains : []),
  ],
  transports: {
    [mainnet.id]: fallback([unstable_connector(injected), http()]),
    [bsc.id]: fallback([
      http(
        'https://smart-burned-patron.bsc.quiknode.pro/d8340a43ded2474d18828922b6df34efc4d4f190/'
      ),
      unstable_connector(injected),
      http(),
    ]),
    [base.id]: fallback([
      http(
        'https://proportionate-skilled-dinghy.base-mainnet.quiknode.pro/09c165cec4358bc65dbb5695ceb663741662b638/'
      ),
      unstable_connector(injected),
      http(),
    ]),
    [blast.id]: fallback([
      http(
        'https://maximum-autumn-pallet.blast-mainnet.quiknode.pro/8e19e2cff98f32361895ec231925b109b0f99a92/'
      ),
      unstable_connector(injected),
      http(),
    ]),
    [opBNB.id]: fallback([unstable_connector(injected), http()]),
    [scroll.id]: fallback([unstable_connector(injected), http()]),
    [fantom.id]: fallback([unstable_connector(injected), http()]),
    [zkSync.id]: fallback([unstable_connector(injected), http()]),

    // testnet
    ...(dotenv.isDev ? dev.transports : ({} as typeof dev.transports)),
  },
})

export type ConfigChainId = (typeof wagmiConfig)['chains'][number]['id']
