import { useReadContract } from 'wagmi'
import { Address, zeroAddress } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/number'
import { v3Addr } from '@/contract/v3/address'
import { v3BondingCurveAbi } from '@/contract/v3/abi/bonding-curve'

export const usePools = (tokenAddr?: string, overrideChainId?: number) => {
  const { chainId } = useChainInfo()
  const cId = overrideChainId ?? chainId
  const { bondingCurve } = v3Addr[cId] ?? {}

  const { data: pools = [], refetch: refetchPools } = useReadContract({
    abi: v3BondingCurveAbi,
    address: bondingCurve,
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
