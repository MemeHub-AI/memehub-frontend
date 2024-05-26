const deployFee = 2000671350000000 // 0.00200067135 ETH
const deploySymbol = 'ETH'

const reserveRatio = BigInt(800000)
const nativeTokenAddress = {
  scroll: '0x5300000000000000000000000000000000000004',
  ethereum: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  bsc_testnet: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  op_bsc_testnet: '0x4200000000000000000000000000000000000006',
} as const
const routerAddress = {
  scroll: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
  ethereum: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  bsc_testnet: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  op_bsc_testnet: '0x62ff25cfd64e55673168c3656f4902bd7aa5f0f4',
} as const

export const useDeployConfig = () => {
  return {
    deployFee,
    deploySymbol,
    reserveRatio,
    nativeTokenAddress,
    routerAddress,
  }
}
