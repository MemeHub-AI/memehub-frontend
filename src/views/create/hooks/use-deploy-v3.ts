import { Config } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import { parseEther } from 'viem'

import type { DeployParams } from './use-deploy'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { DEPLOY_FEE } from '@/constants/contract'
import { getV3Config } from '@/contract/v3/config'

export const useDeployV3 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { chainId, chainName } = useChainInfo()
  const { getAirdropParams } = useCreateToken()

  const deployV3 = async ({
    name,
    ticker,
    marketing,
    onSuccess,
  }: DeployParams) => {
    const config = getV3Config(chainId)
    if (!config || !chainId) {
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
        ...config.bondingCurveConfig,
        functionName: 'createToken',
        args: [
          name,
          ticker,
          // TODO: add to config.
          parseEther('10.345'),
          { ...airdropParams, isDistribution: true },
        ],
        value: DEPLOY_FEE.v3,
      },
      { onSuccess }
    )
  }

  return {
    deployV3,
  }
}
