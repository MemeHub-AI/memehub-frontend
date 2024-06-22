import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import {
  MarketType,
  type Marketing,
  type TokenUpdateReq,
} from '@/api/token/types'

import { tokenApi } from '@/api/token'
import { airdropApi } from '@/api/airdrop'
import { AirdropMerkleRootRes } from '@/api/airdrop/types'
import { bondDistributorParams } from '@/contract/v2/config/bond'

export const useCreateToken = () => {
  // Submit created token to backend.
  const {
    data: createData,
    error: createTokenError,
    isPending: isCreatingToken,
    mutateAsync: create,
  } = useMutation({
    mutationKey: [tokenApi.create.name],
    mutationFn: tokenApi.create,
  })
  const createTokenData = createData?.data

  // Update already created token. used for create error or interrupted.
  const {
    data: updateData,
    error: updateTokenError,
    isPending: isUpdatingToken,
    mutateAsync: update,
  } = useMutation({
    mutationKey: [tokenApi.update.name],
    mutationFn: (params: TokenUpdateReq & { addr: string }) => {
      const { addr, ...req } = params
      return tokenApi.update(addr, req)
    },
  })
  const updateTokenData = updateData?.data

  const {
    data: merkleRootData,
    error: merkleRootError,
    isPending: isGettingMerkleRoot,
    mutateAsync: getMerkleRoot,
  } = useMutation({
    mutationKey: [airdropApi.getMerkleRoot.name],
    mutationFn: airdropApi.getMerkleRoot,
  })

  const parsePercent = (p: number) => BigNumber(p).multipliedBy(100).toNumber()

  const updateAirdropParams = (
    data: AirdropMerkleRootRes,
    params: typeof bondDistributorParams,
    marketing: Marketing[]
  ) => {
    const { kol_count, kol_root_hash, community_count, community_root_hash } =
      data
    // A new object must be used.
    const p = { ...params } as typeof bondDistributorParams

    const kol = marketing.find((m) => m.type === MarketType.Kol)
    const cmnt = marketing.find((m) => m.type === MarketType.Community)

    // Is kol airdrop.
    if (kol_count && kol_root_hash && kol) {
      p.distributionRatioKol = parsePercent(kol.percent)
      p.walletCountKol = kol_count
      p.merkleRootKol = kol_root_hash
    }

    // Is community airdrop.
    if (community_count && community_root_hash && cmnt) {
      p.distributionRatioCommunity = parsePercent(cmnt.percent)
      p.walletCountCommunity = community_count
      p.merkleRootCommunity = community_root_hash
    }

    return p
  }

  const getAirdropParams = async (
    chain: string,
    marketing: Marketing[] | undefined
  ) => {
    const type_list = marketing?.map((m) => m.type).join(',') ?? ''

    // Didn't select marketing.
    if (!marketing || isEmpty(type_list)) return bondDistributorParams

    try {
      const { data } = await getMerkleRoot({ chain, type_list })
      if (data) {
        return updateAirdropParams(data, bondDistributorParams, marketing)
      }

      return bondDistributorParams
    } catch (error) {
      return
    }
  }

  return {
    createTokenData,
    updateTokenData,
    merkleRootData,
    createTokenError,
    updateTokenError,
    merkleRootError,
    isCreatingToken,
    isUpdatingToken,
    isGettingMerkleRoot,
    create,
    update,
    getMerkleRoot,
    getAirdropParams,
  }
}
