import { commonAddr } from '@/contract/address'
import { v3Addr } from './address'

import { makeConfig } from '@/utils/contract'
import { v3BondingCurveAbi } from './abi/bonding-curve'
import { v3DistributorAbi } from './abi/distributor'
import { v3RecommendAbi } from './abi/recommend'
import { v3Params } from './params'

export const getV3Config = (chainId: number | undefined) => {
  if (!chainId) return {}

  const id = chainId as keyof typeof v3Addr
  const addr = v3Addr[id]
  const commonAddress = commonAddr[id]
  const params = v3Params[id]
  if (!addr || !commonAddress) return {}

  return {
    commonAddress,

    bondingCurveConfig: makeConfig(v3BondingCurveAbi, addr.bondingCurve),
    bondingCurveParams: params.bondingCurve,

    distributorConfig: makeConfig(v3DistributorAbi, addr.distributor),
    distributorParams: params.distributor,

    recommendConfig: makeConfig(v3RecommendAbi, addr.recommend),
  }
}
