import { Config, useReadContract } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

import type { DeployParams } from './use-deploy'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { AirdropMerkleRootRes } from '@/api/airdrop/types'
import { MarketType, Marketing } from '@/api/token/types'
import { v3DistributorParams } from '@/config/v3'
import { v3BondingCurveAbi } from '@/contract/v3/abi/bonding-curve'
import { v3Addr } from '@/contract/v3/address'
import { BI_ZERO } from '@/constants/number'

export const useDeployV3 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { chainId, chainName, walletChainId } = useChainInfo()
  const { getMerkleRoot } = useCreateToken()
  const { bondingCurve } = v3Addr[walletChainId ?? 0] ?? {}

  const { data: creationFee = BI_ZERO } = useReadContract({
    abi: v3BondingCurveAbi,
    address: bondingCurve,
    chainId: walletChainId,
    functionName: 'creationFee_',
    query: { enabled: !!bondingCurve },
  })

  const parsePercent = (p: number) => {
    return BigNumber(p).multipliedBy(100).multipliedBy(100).toNumber()
  }

  const updateAirdropParams = (
    data: AirdropMerkleRootRes,
    params: NonNullable<typeof v3DistributorParams>,
    marketing: Marketing[]
  ) => {
    const { kol_count, kol_root_hash, community_count, community_root_hash } =
      data
    // A new object must be used.
    const p = { ...params } as NonNullable<typeof v3DistributorParams>

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
    if (!v3DistributorParams) return

    const type_list = marketing?.map((m) => m.type).join(',') ?? ''
    if (!marketing || isEmpty(type_list)) return v3DistributorParams

    try {
      const { data } = await getMerkleRoot({ chain, type_list })
      if (data) {
        return updateAirdropParams(data, v3DistributorParams, marketing)
      }

      return v3DistributorParams
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
    if (!bondingCurve || !chainId || !chainName) {
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
        abi: v3BondingCurveAbi,
        address: bondingCurve,
        functionName: 'createToken',
        chainId: walletChainId,
        args: [name, ticker, airdropParams],
        value: creationFee,
      },
      { onSuccess }
    )
  }

  return {
    creationFee,
    deployV3,
  }
}
