import { useTonAddress } from '@tonconnect/ui-react'
import { useAccount } from 'wagmi'

export const useWallet = () => {
  const tonAddress = useTonAddress()
  const { address } = useAccount()

  const walletAddress = tonAddress || address

  return { walletAddress }
}
