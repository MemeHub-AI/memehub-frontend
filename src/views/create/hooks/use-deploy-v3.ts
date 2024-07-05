import { Config } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

import type { DeployParams } from './use-deploy'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getV3Config } from '@/contract/v3/config'
import { AirdropMerkleRootRes } from '@/api/airdrop/types'
import { MarketType, Marketing } from '@/api/token/types'

export const useDeployV3 = (
  writeContract: WriteContractMutate<Config, unknown>,
  fee: bigint
) => {
  const { chainId, chainName } = useChainInfo()
  const { getMerkleRoot } = useCreateToken()
  const { bondingCurveConfig, distributorParams } = getV3Config(chainId)

  const parsePercent = (p: number) => {
    return BigNumber(p).multipliedBy(100).multipliedBy(100).toNumber()
  }

  const updateAirdropParams = (
    data: AirdropMerkleRootRes,
    params: NonNullable<typeof distributorParams>,
    marketing: Marketing[]
  ) => {
    const { kol_count, kol_root_hash, community_count, community_root_hash } =
      data
    // A new object must be used.
    const p = { ...params } as NonNullable<typeof distributorParams>

    const kol = marketing.find((m) => m.type === MarketType.Kol)
    const cmnt = marketing.find((m) => m.type === MarketType.Community)

    // Is kol airdrop.
    if (kol_count && kol_root_hash && kol) {
      p.isDistribution = true
      p.distributionRatioKol = parsePercent(kol.percent)
      p.walletCountKol = kol_count
      p.merkleRootKol = kol_root_hash
    }

    // Is community airdrop.
    if (community_count && community_root_hash && cmnt) {
      p.isDistribution = true
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
    if (!distributorParams) return

    const type_list = marketing?.map((m) => m.type).join(',') ?? ''
    if (!marketing || isEmpty(type_list)) return distributorParams

    try {
      const { data } = await getMerkleRoot({ chain, type_list })
      if (data) {
        return updateAirdropParams(data, distributorParams, marketing)
      }

      return distributorParams
    } catch (error) {
      return
    }
  }

  const deployV3 = async ({
    name,
    ticker,
    marketing,
    onSuccess,
  }: DeployParams) => {
    if (!bondingCurveConfig || !chainId || !chainName) {
      CONTRACT_ERR.configNotFound()
      return
    }

    const airdropParams = await getAirdropParams(chainName, marketing)
    if (!airdropParams) {
      CONTRACT_ERR.marketParamsNotFound()
      return
    }

    console.log('v3 deploy', airdropParams)
    writeContract(
      {
        ...bondingCurveConfig,
        functionName: 'createToken',
        args: [name, ticker, airdropParams],
        value: fee,
      },
      { onSuccess }
    )
  }

  return {
    deployV3,
  }
}
