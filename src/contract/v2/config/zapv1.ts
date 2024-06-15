import { getV2Addr } from '.'
import { v2ZapV1Abi } from '../abi/zapv1'

export const getZapV1Config = (chainId: number) => {
  const addr = getV2Addr(chainId)
  // We can't use lodash's `isEmpty` here, because it will not Type Narrowing
  if (addr.length === 0) return

  const [v2Addr] = addr

  return {
    abi: v2ZapV1Abi,
    address: v2Addr.zapV1,
  }
}
