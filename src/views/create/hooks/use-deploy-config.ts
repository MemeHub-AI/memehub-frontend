import { useAccount } from 'wagmi'

const deployFee = 2000671350000000 // 0.00200067135 ETH

const reserveRatio = BigInt(800000)

export const useDeployConfig = () => {
  const { chain } = useAccount()
  // TODO: maybe we need backend symbol?
  const deploySymbol = chain?.nativeCurrency.symbol

  return {
    deployFee,
    deploySymbol,
    reserveRatio,
  }
}
