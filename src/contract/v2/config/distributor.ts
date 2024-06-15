import { getV2Addr } from '.'
import { v2DistributorAbi } from '../abi/distributor'

export const getDistributorConfig = (chainId: number) => {
  const addr = getV2Addr(chainId)
  if (addr.length === 0) return

  const [v2Addr] = addr

  return {
    abi: v2DistributorAbi,
    address: v2Addr.distributor,
  }
}
