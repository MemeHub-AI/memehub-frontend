import { useAccount } from 'wagmi'

const deployFee = 2000671350000000 // 0.00200067135 native token

const reserveRatio = BigInt(800000)

export const useDeployConfig = () => {
  const { chain } = useAccount()
  const deploySymbol = chain?.nativeCurrency.symbol

  return {
    deployFee,
    deploySymbol,
    reserveRatio,
  }
}
