import { Adapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  TrustWalletAdapter,
  BitgetWalletAdapter,
} from '@solana/wallet-adapter-wallets'

export interface WalletInfo {
  name: string
  icon: string
  installed: boolean
  chain: string[]
  /** Ton connect need it */
  bridge_key?: string
  hidden?: boolean
  recommend: boolean
  // connecting: boolean
  // connected: boolean
  // wallet_url: string
  // download_url: string | null
}

export const chainList = [
  {
    name: 'Ethereum',
    image_url: 'https://storage.memehub.ai/chains/logo/ethereum.png',
  },
  {
    name: 'Solana',
    image_url: 'https://storage.memehub.ai/chains/logo/solana.png',
  },
  {
    name: 'Ton',
    image_url: 'https://storage.memehub.ai/chains/logo/ton.png',
  },
]

export const supportWallets = [
  'MetaMask',
  'WalletConnect',
  'Phantom',
  'Trust',
  'Bitget',
  'Magic Eden',
  'MyTonWallet',
  'Tonkeeper',
  'Coinbase Wallet',
  'OKX Wallet',
  'Rainbow',
]

// solana
export const solanaDevNet = WalletAdapterNetwork.Devnet
export const solanaMainNet = WalletAdapterNetwork.Mainnet

// solana wallets adapters
export const solanaWallets: Adapter[] = [
  new PhantomWalletAdapter(),
  new TrustWalletAdapter(),
  new BitgetWalletAdapter(),
]
