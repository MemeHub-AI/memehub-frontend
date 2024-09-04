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
    [sepolia.id]: fallback([http(), unstable_connector(injected)]),
    [bscTestnet.id]: fallback([
      http(
        'https://polished-old-valley.bsc-testnet.quiknode.pro/af2b2e4daee6f862aaff645c537377f3d4605d79/'
      ),
      http(),
      unstable_connector(injected),
    ]),
    [opBNBTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [scrollSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [baseSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [blastSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [fantomTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [zkSyncSepoliaTestnet.id]: fallback([http(), unstable_connector(injected)]),
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
    [mainnet.id]: fallback([http(), unstable_connector(injected)]),
    [bsc.id]: fallback([
      http(
        'https://boldest-lingering-glitter.bsc.quiknode.pro/6c56a67ee96c7b3e30f1f4f3fe24dc91c0d8a77d/'
      ),
      http(),
      unstable_connector(injected),
    ]),
    [base.id]: fallback([
      http(
        'https://proportionate-skilled-dinghy.base-mainnet.quiknode.pro/09c165cec4358bc65dbb5695ceb663741662b638/'
      ),
      http(),
      unstable_connector(injected),
    ]),
    [blast.id]: fallback([
      http(
        'https://maximum-autumn-pallet.blast-mainnet.quiknode.pro/8e19e2cff98f32361895ec231925b109b0f99a92/'
      ),
      http(),
      unstable_connector(injected),
    ]),
    [opBNB.id]: fallback([http(), unstable_connector(injected)]),
    [scroll.id]: fallback([http(), unstable_connector(injected)]),
    [fantom.id]: fallback([http(), unstable_connector(injected)]),
    [zkSync.id]: fallback([http(), unstable_connector(injected)]),

    // testnet
    ...(dotenv.isDev ? dev.transports : []),
  },
})

export type ConfigChainId = (typeof wagmiConfig)['chains'][number]['id']
