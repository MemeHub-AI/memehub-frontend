import { http, createConfig, fallback, unstable_connector } from 'wagmi'
import { injected } from 'wagmi/connectors'
import {
  scroll,
  scrollSepolia,
  mainnet,
  bsc,
  bscTestnet,
  opBNBTestnet,
} from 'wagmi/chains'

const prod = createConfig({
  chains: [scroll, mainnet, bsc],
  connectors: [injected()],
  transports: {
    [scroll.id]: fallback([http(), unstable_connector(injected)]),
    [mainnet.id]: fallback([http(), unstable_connector(injected)]),
    [bsc.id]: fallback([http(), unstable_connector(injected)]),
  },
  ssr: true,
})

const dev = createConfig({
  chains: [scrollSepolia, bscTestnet, opBNBTestnet],
  connectors: [injected()],
  transports: {
    [scrollSepolia.id]: fallback([http(), unstable_connector(injected)]),
    [bscTestnet.id]: fallback([http(), unstable_connector(injected)]),
    [opBNBTestnet.id]: fallback([http(), unstable_connector(injected)]),
  },
  ssr: true,
})

export const wagmiConfig = prod
