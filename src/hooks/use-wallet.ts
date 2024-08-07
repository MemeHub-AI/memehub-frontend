import { useTonAddress } from '@tonconnect/ui-react'
import { useAccount } from 'wagmi'

export const useWallet = () => {
  const tonAddress = useTonAddress()
  const { address } = useAccount()

  const walletAddress = () => {
    if (tonAddress !== '') {
      return tonAddress
    }

    if (address) {
      return address
    }

    return 'no wallet'
  }

  return { walletAddress }
}
