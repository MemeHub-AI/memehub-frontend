import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'
import { MarketType } from '@/api/token/types'
import { BI_ZERO } from '@/constants/number'

export const useAirdropInfo = (
  type: MarketType,
  chainName?: string,
  id?: number | null
) => {
  id = id ?? 0 // Adapt null

  const { address } = useAccount()
  const { chainId } = useChainInfo(chainName)

  const { isKol, distributorConfig, bondingCurveConfig, tokenConfig } =
    useMemo(() => {
      return {
        isKol: type === MarketType.Kol,
        isCommunity: type === MarketType.Community,
        ...getV3Config(chainId),
      }
    }, [type, chainId])

  const { data: airdropInfo = [], refetch } = useReadContract({
    ...distributorConfig!,
    functionName: 'distributions',
    args: [BigInt(id)],
    chainId,
    query: { enabled: !!distributorConfig },
  })
  const [
    tokenAddr,
    kolCount = 0,
    communityCount = 0,
    claimedKolCount = 0,
    claimedCommunityCount = 0,
    ,
    ,
    ,
    kolAmount = BI_ZERO,
    communityAmount = BI_ZERO,
  ] = airdropInfo
  const total = isKol ? kolCount : communityCount
  const claimed = isKol ? claimedKolCount : claimedCommunityCount
  const perAmount = formatEther(isKol ? kolAmount : communityAmount)

  const { data: ratio = BI_ZERO } = useReadContract({
    ...bondingCurveConfig!,
    chainId,
    functionName: 'airdropRate_',
    query: { enabled: !!bondingCurveConfig },
  })
  const { data: totalSupply = BI_ZERO } = useReadContract({
    ...tokenConfig!,
    address: tokenAddr,
    chainId,
    functionName: 'totalSupply',
    query: { enabled: !!tokenConfig },
  })
  const airdropRatio = Number(ratio) / 100 / 100
  const totalAirdrop = +formatEther(totalSupply) * airdropRatio
  const remain = totalAirdrop - claimed * +perAmount

  const { data: duration = BI_ZERO } = useReadContract({
    ...distributorConfig!,
    functionName: 'duration',
    chainId,
    query: { enabled: !!distributorConfig },
  })
  const durationSeconds = Number(duration)

  // Only query if type is kol.
  const {
    data: isKolClaimed,
    isFetching: isFetchingKol,
    refetch: refetchKol,
  } = useReadContract({
    ...distributorConfig!,
    functionName: 'isClaimedKOL',
    args: [BigInt(id), address!],
    chainId,
    query: { enabled: !!address && type === MarketType.Kol },
  })

  // Only query if type is community.
  const {
    data: isCommunityClaimed,
    isFetching: isFetchingCommunity,
    refetch: refetchCommunity,
  } = useReadContract({
    ...distributorConfig!,
    functionName: 'isClaimedCommunity',
    args: [BigInt(id), address!],
    chainId,
    query: { enabled: !!address && type === MarketType.Community },
  })
  const isClaimed = isKol ? isKolClaimed : isCommunityClaimed

  const { data: isBurned } = useReadContract({
    ...distributorConfig!,
    chainId,
    functionName: 'isBurn',
    args: [BigInt(id)],
  })

  const refetchIsClaimed = () => {
    refetchKol()
    refetchCommunity()
  }

  return {
    airdropRatio,
    totalAirdrop,
    remain,
    total,
    claimed,
    durationSeconds,
    isClaimed,
    isFetchingKol,
    isFetchingCommunity,
    refetch,
    refetchIsClaimed,
  }
}
