import { useReadContract } from 'wagmi'
import { Address, zeroAddress } from 'viem'

import { getV3Config } from '@/contract/v3/config'
import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/number'

export const usePools = (tokenAddr?: string, overrideChainId?: number) => {
  const { chainId } = useChainInfo()
  const cId = overrideChainId ?? chainId
  const { bondingCurveConfig } = getV3Config(cId)

  const { data: pools = [], refetch: refetchPools } = useReadContract({
    ...bondingCurveConfig!,
    chainId: cId,
    functionName: 'pools_',
    args: [tokenAddr! as Address],
    query: {
      enabled: !!bondingCurveConfig && !!tokenAddr,
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
    headmaster,
  ] = pools

  const isGrauated = !!(headmaster && headmaster !== zeroAddress)

  return {
    token,
    tokenReserve,
    vTokenReserve,
    ethReserve,
    vEthReserve,
    addPoolEthAmount,
    creator,
    headmaster,
    isGrauated,
    refetchPools,
  }
}
