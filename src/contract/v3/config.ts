import { commonAddr } from '@/contract/address'
import { v3Addr } from './address'

import { v2BondAbi } from '@/contract/v2/abi/bond'
import { makeConfig } from '@/utils/contract'
import { v2DistributorAbi } from '@/contract/v2/abi/distributor'
import { v2RecommendAbi } from '@/contract/v2/abi/recommend'

export const getV3Config = (chainId: number | undefined) => {
  if (!chainId) return

  const id = chainId as keyof typeof v3Addr
  const addr = v3Addr[id]
  const commonAddress = commonAddr[id]
  if (!addr || !commonAddress) return

  return {
    commonAddress,
    bondingCurveConfig: makeConfig(v2BondAbi, addr.bondingCurve),
    distributorConfig: makeConfig(v2DistributorAbi, addr.distributor),
    recommendConfig: makeConfig(v2RecommendAbi, addr.recommend),
  }
}
