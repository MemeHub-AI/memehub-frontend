import { getV2Addr } from '.'
import { v2TokenAbi } from '../abi/token'

export const getTokenConfig = (chainId: number) => {
  const addr = getV2Addr(chainId)
  if (addr.length === 0) return

  const [v2Addr] = addr

  return {
    abi: v2TokenAbi,
    address: v2Addr.token,
  }
}
