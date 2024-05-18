import { http, createConfig, fallback, unstable_connector } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { first } from 'lodash'

const prod = createConfig({
  chains: [scroll],
  connectors: [injected()],
  transports: {
    [scroll.id]: fallback([http(), unstable_connector(injected)]),
  },
  ssr: true,
})

const dev = createConfig({
  chains: [scrollSepolia],
  connectors: [injected()],
  transports: {
    [scrollSepolia.id]: fallback([http(), unstable_connector(injected)]),
  },
  ssr: true,
})

export const wagmiConfig = prod

export const chain = first(wagmiConfig.chains)!
