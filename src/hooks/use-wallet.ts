import { useAccount } from 'wagmi'

export const useWallet = () => {
  // const tonAddress = useTonAddress()
  const { address } = useAccount()
  // const { publicKey } = useSolWallet()

  const walletAddress = () => {
    // TODO: TON wallet support
    // if (tonAddress !== '') {
    //   return tonAddress
    // }

    if (address) {
      return address
    }

    // if (publicKey) {
    //   return publicKey.toString()
    // }

    return address
  }

  return { walletAddress }
}
