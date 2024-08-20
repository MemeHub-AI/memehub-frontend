import { useTonAddress } from '@tonconnect/ui-react'
import { useAccount } from 'wagmi'
// import { Wallet } from '@solana/wallet-adapter-react'
import { useWallet as useSolWallet } from '@solana/wallet-adapter-react'

export const useWallet = () => {
  // const tonAddress = useTonAddress()
  const { address } = useAccount()
  const { publicKey } = useSolWallet()

  const walletAddress = () => {
    // TODO: TON wallet support
    // if (tonAddress !== '') {
    //   return tonAddress
    // }

    if (address) {
      return address
    }

    if (publicKey) {
      return publicKey.toString()
    }

    return 'no wallet'
  }

  return { walletAddress }
}
