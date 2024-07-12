import { zeroAddress } from 'viem'

import { v3Addr } from './address'
import { makeConfig } from '@/utils/contract'
import { v3BondingCurveAbi } from './abi/bonding-curve'
import { v3DistributorAbi } from './abi/distributor'
import { v3RecommendAbi } from './abi/recommend'
import { v3TokenAbi } from './abi/token'

export const getV3Config = (chainId: number | undefined) => {
  if (!chainId) return {}

  const id = chainId as keyof typeof v3Addr
  const addr = v3Addr[id]

  if (!addr) return {}

  return {
    bondingCurveConfig: makeConfig(v3BondingCurveAbi, addr.bondingCurve),
    distributorConfig: makeConfig(v3DistributorAbi, addr.distributor),
    recommendConfig: makeConfig(v3RecommendAbi, addr.recommend),
    tokenConfig: makeConfig(v3TokenAbi, zeroAddress),
  }
}
