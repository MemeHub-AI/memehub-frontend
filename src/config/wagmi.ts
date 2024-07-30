import { http, createConfig, fallback, unstable_connector } from 'wagmi'
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
    [bscTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [opBNBTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [scrollSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [baseSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [blastSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [fantomTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [zkSyncSepoliaTestnet.id]: fallback([http(), unstable_connector(injected)]),
  },
}

export const wagmiConfig = createConfig({
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
  connectors: [injected()],
  transports: {
    [mainnet.id]: fallback([http(), unstable_connector(injected)]),
    [bsc.id]: fallback([
      http(
        'https://smart-burned-patron.bsc.quiknode.pro/d8340a43ded2474d18828922b6df34efc4d4f190/'
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
    ...(dotenv.isDev ? dev.transports : ({} as typeof dev.transports)),
  },
  ssr: true,
})

export type ChainId = (typeof wagmiConfig)['chains'][number]['id']
