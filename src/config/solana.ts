import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { web3 } from '@coral-xyz/anchor'

import { dotenv } from '@/utils/env'

const prod = {
  endpoint: web3.clusterApiUrl(WalletAdapterNetwork.Mainnet),
  wallets: [],
}

const dev = {
  endpoint: web3.clusterApiUrl(WalletAdapterNetwork.Devnet),
  wallets: [],
}

export const solConfig = dotenv.isDev ? dev : prod
