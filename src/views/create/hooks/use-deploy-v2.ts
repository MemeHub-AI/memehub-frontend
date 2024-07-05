import { Config } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

import type { DeployParams } from './use-deploy'
import { useCreateToken } from './use-create-token'
import { bondDistributorParams, getBondConfig } from '@/contract/v2/config/bond'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { AirdropMerkleRootRes } from '@/api/airdrop/types'
import { MarketType, Marketing } from '@/api/token/types'

/** Depreacted */
export const useDeployV2 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { chainId, chainName } = useChainInfo()
  const { getMerkleRoot } = useCreateToken()

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

  const deployV2 = async ({
    name,
    ticker,
    marketing,
    onSuccess,
  }: DeployParams) => {
    const config = getBondConfig(chainId)
    if (!chainId || !config || !chainName) {
      CONTRACT_ERR.configNotFound()
      return
    }

    const [bondConfig, bondParams] = config
    const airdropParams = await getAirdropParams(chainName, marketing)
    if (!airdropParams) {
      CONTRACT_ERR.marketParamsNotFound()
      return
    }

    console.log('v2 deploy', airdropParams)
    writeContract(
      {
        ...bondConfig,
        functionName: 'createToken',
        args: [{ name, symbol: ticker }, bondParams, airdropParams],
        // value: DEPLOY_FEE.v2,
      },
      { onSuccess }
    )
  }

  return {
    deployV2,
  }
}
