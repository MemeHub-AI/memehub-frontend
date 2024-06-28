import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'

import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'
import { MarketType } from '@/api/token/types'
import { BI_ZERO } from '@/constants/contract'

export const useAirdropInfo = (
  type: MarketType,
  chainName?: string,
  id?: number | null
) => {
  id = id ?? 0 // Adapt null

  const { address } = useAccount()
  const { chainId } = useChainInfo(chainName)

  const { isKol, distributorConfig } = useMemo(() => {
    const { distributorConfig } = getV3Config(chainId)
    return {
      isKol: type === MarketType.Kol,
      isCommunity: type === MarketType.Community,
      distributorConfig,
    }
  }, [type, chainId])

  const { data: airdropInfo = [], refetch } = useReadContract({
    ...distributorConfig!,
    functionName: 'distributions',
    args: [BigInt(id)],
    chainId,
    query: { enabled: !!distributorConfig },
  })

  const { total, claimed } = useMemo(() => {
    const [
      ,
      kolCount = 0,
      communityCount = 0,
      claimedKolCount = 0,
      claimedCommunityCount = 0,
    ] = airdropInfo

    return {
      total: isKol ? kolCount : communityCount,
      claimed: isKol ? claimedKolCount : claimedCommunityCount,
    }
  }, [airdropInfo])

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

  const isClaimed = useMemo(() => {
    return isKol ? isKolClaimed : isCommunityClaimed
  }, [isKolClaimed, isCommunityClaimed])

  const refetchIsClaimed = () => {
    refetchKol()
    refetchCommunity()
  }

  return {
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
