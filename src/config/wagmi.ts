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
import { first } from 'lodash'

// const prod = createConfig({
//   chains: [bscTestnet, bsc, scroll, mainnet],
//   connectors: [injected()],
//   transports: {
//     [bscTestnet.id]: fallback([http(), unstable_connector(injected)]),
//     [bsc.id]: fallback([http(), unstable_connector(injected)]),
//     [scroll.id]: fallback([http(), unstable_connector(injected)]),
//     [mainnet.id]: fallback([http(), unstable_connector(injected)]),
//   },
//   ssr: true,
// })

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

export const wagmiConfig = dev

export const chain = first(wagmiConfig.chains)!
