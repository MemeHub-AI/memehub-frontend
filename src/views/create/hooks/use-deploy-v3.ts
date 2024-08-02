import { Config, useReadContract } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'

import type { DeployParams } from './use-deploy'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'
import { v3BondingCurveAbi } from '@/contract/abi/v1/bonding-curve'
import { v3Addr } from '@/contract/address'
import { BI_ZERO } from '@/constants/number'
import { useAirdropParams } from './use-airdrop-params'

export const useDeployV3 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { chainName, walletChainId = 0 } = useChainInfo()
  const { bondingCurve } = v3Addr[walletChainId] ?? {}
  const { getParams } = useAirdropParams()

  const { data: creationFee = BI_ZERO } = useReadContract({
    abi: v3BondingCurveAbi,
    address: bondingCurve,
    chainId: walletChainId,
    functionName: 'creationFee_',
    query: { enabled: !!bondingCurve },
  })

  const deployV3 = async ({
    name,
    ticker,
    marketing,
    onSuccess,
  }: DeployParams) => {
    if (!bondingCurve || !chainName) {
      CONTRACT_ERR.configNotFound()
      return
    }

    const airdropParams = await getParams(chainName, marketing)
    if (!airdropParams) {
      CONTRACT_ERR.marketParamsNotFound()
      return
    }

    // TODO: should simulate first.
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
