import { useMutation } from '@tanstack/react-query'

import { MarketType, Marketing } from '@/api/token/types'
import { AirdropType, v3DistributorParams } from '@/config/v3'
import { airdropApi } from '@/api/airdrop'
import { AirdropMerkleRootRes } from '@/api/airdrop/types'
import { reportException } from '@/errors'

export const useAirdropParams = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationKey: [airdropApi.getMerkleRoot.name],
    mutationFn: airdropApi.getMerkleRoot,
  })

  const updateParams = (
    params: typeof v3DistributorParams,
    {
      kolRatio,
      kol_count,
      kol_root_hash,
      cmntRatio,
      community_count,
      community_root_hash,
    }: AirdropMerkleRootRes & { kolRatio: number; cmntRatio: number }
  ) => {
    if (kol_count && kol_root_hash) {
      params.isDistribution = true
      params.distributionRatioKol = kolRatio * 100
      params.walletCountKol = kol_count
      params.kolFlag = AirdropType.All
    }
    if (community_count && community_root_hash) {
      params.isDistribution = true
      params.distributionRatioCommunity = cmntRatio * 100
      params.walletCountCommunity = community_count
      params.CommunityFlag = AirdropType.All
    }
    return params
  }

  const getParams = async (
    chain: string,
    marketing: Marketing[] | undefined
  ) => {
    const kol = marketing?.find((m) => m.type === MarketType.Kol)
    const cmnt = marketing?.find((m) => m.type === MarketType.Community)

    // No selelct airdrop.
    if (!marketing || !(kol && cmnt)) return v3DistributorParams

    try {
      const { data } = await mutateAsync({
        chain,
        type_list: [kol.type, cmnt.type].join(','),
      })

      if (data) {
        return updateParams(
          { ...v3DistributorParams },
          { ...data, kolRatio: kol.percent, cmntRatio: cmnt.percent }
        )
      }
      return v3DistributorParams
    } catch (e) {
      reportException(e)
      return
    }
  }

  return {
    isPending,
    getParams,
  }
}
