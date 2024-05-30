import { http, createConfig, fallback, unstable_connector } from 'wagmi'
import { injected } from 'wagmi/connectors'
import {
  mainnet,
  bsc,
  opBNB,
  scroll,
  sepolia,
  bscTestnet,
  opBNBTestnet,
  scrollSepolia,
} from 'wagmi/chains'

const prod = createConfig({
  chains: [mainnet, bsc, opBNB, scroll],
  connectors: [injected()],
  transports: {
    [mainnet.id]: fallback([http(), unstable_connector(injected)]),
    [bsc.id]: fallback([http(), unstable_connector(injected)]),
    [opBNB.id]: fallback([http(), unstable_connector(injected)]),
    [scroll.id]: fallback([http(), unstable_connector(injected)]),
  },
  ssr: true,
})

const dev = createConfig({
  chains: [sepolia, bscTestnet, opBNBTestnet, scrollSepolia, ...prod.chains],
  connectors: [injected()],
  transports: {
    [sepolia.id]: fallback([http(), unstable_connector(injected)]),
    [bscTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [opBNBTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [scrollSepolia.id]: fallback([http(), unstable_connector(injected)]),
    // includes mainnet.
    ...prod._internal.transports,
  },
  ssr: true,
})

export const wagmiConfig = process.env.NODE_ENV === 'production' ? prod : dev
