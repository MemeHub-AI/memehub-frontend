import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'

import { dotenv } from '@/utils/env'

const prod = {
  endpoint: clusterApiUrl(WalletAdapterNetwork.Mainnet),
  wallets: [],
}

const dev = {
  endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
  wallets: [
    // TODO/low: uncomment?
    // new UnsafeBurnerWalletAdapter()
  ],
}

export const solConfig = dotenv.isDev ? dev : prod
