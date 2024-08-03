import { useReadContract } from 'wagmi'
import { Address, zeroAddress } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/number'
import { addrMap } from '@/contract/address'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'

export const usePools = (tokenAddr?: string, overrideChainId?: number) => {
  const { chainId } = useChainInfo()
  const cId = overrideChainId ?? chainId
  const { bondingCurve } = addrMap[cId] ?? {}

  const { data: pools = [], refetch: refetchPools } = useReadContract({
    abi: bondingCurveAbiMap['0.1.0'], // TODO: match version
    address: bondingCurve!,
    chainId: cId,
    functionName: 'pools_',
    args: [tokenAddr! as Address],
    query: {
      enabled: !!bondingCurve && !!tokenAddr,
      refetchInterval: 10_000, // refresh each 10s.
    },
  })
  const [
    token,
    tokenReserve = BI_ZERO,
    vTokenReserve = BI_ZERO,
    ethReserve = BI_ZERO,
    vEthReserve = BI_ZERO,
    addPoolEthAmount = BI_ZERO,
    creator,
    headmaster = zeroAddress,
  ] = pools

  const isGraduated = headmaster !== zeroAddress

  return {
    token,
    tokenReserve,
    vTokenReserve,
    ethReserve,
    vEthReserve,
    addPoolEthAmount,
    creator,
    headmaster,
    isGraduated,
    refetchPools,
  }
}
