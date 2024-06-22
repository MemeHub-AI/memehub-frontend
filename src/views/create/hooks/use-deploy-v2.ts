import { Config } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'

import type { DeployParams } from './use-deploy'
import { useCreateToken } from './use-create-token'
import { getBondConfig } from '@/contract/v2/config/bond'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { DEPLOY_FEE } from '@/constants/contract'

export const useDeployV2 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { chainId, chainName } = useChainInfo()
  const { getAirdropParams } = useCreateToken()

  const deployV2 = async ({
    name,
    ticker,
    marketing,
    onSuccess,
  }: DeployParams) => {
    const config = getBondConfig(chainId)
    if (!chainId || !config) {
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
        value: DEPLOY_FEE.v2,
      },
      { onSuccess }
    )
  }

  return {
    deployV2,
  }
}
