const deployFee = 2000671350000000 // 0.00200067135 ETH

const deploySymbol = 'ETH'

const reserveRatio = BigInt(800000)

export const useDeployConfig = () => {
  return {
    deployFee,
    deploySymbol,
    reserveRatio,
  }
}
