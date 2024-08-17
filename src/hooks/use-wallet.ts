import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { useAccount } from 'wagmi'
// import { Wallet } from '@solana/wallet-adapter-react'
import { useWallet as useSolWallet } from '@solana/wallet-adapter-react'
import { BaseWalletAdapter } from '@solana/wallet-adapter-base'
export const useWallet = () => {
  const tonAddress = useTonAddress()
  const { address } = useAccount()
  const { publicKey, wallets: solWallets } = useSolWallet()
  const [tonConnectUI] = useTonConnectUI()

  const walletAddress = () => {
    if (tonAddress !== '') {
      return tonAddress
    }

    if (address) {
      return address
    }

    if (publicKey) {
      return publicKey.toString()
    }

    return 'no wallet'
  }

  const getTonWallets = async () => {
    const wallets = await tonConnectUI.getWallets()

    return wallets
  }

  const getSolanaWallets = () => {
    return solWallets
  }

  return {
    walletAddress,
    getTonWallets,
    getSolanaWallets,
  }
}
