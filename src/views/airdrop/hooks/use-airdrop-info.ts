import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { MarketType } from '@/api/token/types'
import { BI_ZERO } from '@/constants/number'
import { v3Addr } from '@/contract/address'
import { v3DistributorAbi } from '@/contract/abi/v1/distributor'
import { v3BondingCurveAbi } from '@/contract/abi/v1/bonding-curve'
import { v3TokenAbi } from '@/contract/abi/v1/token'

export const useAirdropInfo = (
  type: MarketType,
  chainName?: string,
  id?: number | null
) => {
  id = id ?? 0 // Adapt null

  const { address } = useAccount()
  const { chainId } = useChainInfo(chainName)

  const { distributor, bondingCurve } = v3Addr[chainId] ?? {}
  const isKol = type === MarketType.Kol

  const { data: airdropInfo = [], refetch } = useReadContract({
    abi: v3DistributorAbi,
    address: distributor,
    functionName: 'distributions',
    chainId,
    args: [BigInt(id)],
    query: { enabled: !!distributor },
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
    abi: v3BondingCurveAbi,
    address: bondingCurve,
    functionName: 'airdropRate_',
    chainId,
    query: { enabled: !!bondingCurve },
  })
  const { data: totalSupply = BI_ZERO } = useReadContract({
    abi: v3TokenAbi,
    address: tokenAddr,
    chainId,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddr },
  })
  const airdropRatio = Number(ratio) / 100 / 100
  const totalAirdrop = +formatEther(totalSupply) * airdropRatio
  const remain = totalAirdrop - claimed * +perAmount

  const { data: duration = BI_ZERO } = useReadContract({
    abi: v3DistributorAbi,
    address: distributor,
    functionName: 'duration',
    chainId,
    query: { enabled: !!distributor },
  })
  const durationSeconds = Number(duration)

  // Only query if type is kol.
  const {
    data: isKolClaimed,
    isFetching: isFetchingKol,
    refetch: refetchKol,
  } = useReadContract({
    abi: v3DistributorAbi,
    address: distributor,
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
    abi: v3DistributorAbi,
    address: distributor,
    functionName: 'isClaimedCommunity',
    args: [BigInt(id), address!],
    chainId,
    query: { enabled: !!address && type === MarketType.Community },
  })
  const isClaimed = isKol ? isKolClaimed : isCommunityClaimed

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
