import { commonAddr } from '@/contract/address'
import { v2Addr } from '../address'

export const getV2Addr = (chainId: number) => {
  const id = chainId as keyof typeof v2Addr
  const v2Address = v2Addr[id]
  const commonAddress = commonAddr[id]

  if (!v2Address || !commonAddress) return [] as const
  return [v2Address, commonAddress] as const
}
