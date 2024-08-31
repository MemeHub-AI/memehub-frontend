import { useMemo, useState } from 'react'

import type { TokenCreateReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { Network } from '@/enums/contract'
import { useChainsStore } from '@/stores/use-chains-store'
import { deployErr } from '@/errors/deploy'
import { useUserInfo } from '@/hooks/use-user-info'
import { useEvmDeploy } from './use-evm-deploy'
import { useSvmDeploy } from './use-svm-deploy'

export type DeployFormParams = Omit<
  TokenCreateReq,
  'factory_address' | 'airdrop_address'
> & {
  buyAmount: string
}

export const useDeploy = (chainName: string) => {
  const [network, setNetwork] = useState(Network.Evm)
  const { createTokenData, isCreatingToken, createToken } =
    useCreateToken(chainName)
  const { chainsMap } = useChainsStore()
  const { refetchUserInfo } = useUserInfo()

  const onDeployFinally = () => {
    refetchUserInfo()
  }

  const evmDeploy = useEvmDeploy(chainName, onDeployFinally)
  const svmDeploy = useSvmDeploy()
  // const tvmDeploy = useTvmDeploy()

  const {
    initialBuyMax,
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    resetDeploy,
  } = useMemo(() => {
    return {
      [Network.Evm]: evmDeploy,
      [Network.Svm]: svmDeploy,
      [Network.Tvm]: evmDeploy,
    }[network]
  }, [network, evmDeploy, svmDeploy])

  const deploy = async (params: DeployFormParams) => {
    const tokenId = await createToken(params)
    if (!tokenId) return deployErr.createFailed()

    const { network } = chainsMap[params.chain] ?? {}
    if (!network) return deployErr.networkNotFound()

    setNetwork(network)
    if (network === Network.Evm) {
      return evmDeploy.deploy({ ...params, tokenId: tokenId! })
    }
    if (network === Network.Svm) {
      return svmDeploy.deploy()
    }
    if (network === Network.Tvm) {
      // TON
      // return tvmDeploy.deploy(params)
    }
  }

  return {
    initialBuyMax,
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploying: isSubmitting || isConfirming,
    isCreatingToken,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    createTokenData,
    deploy,
    resetDeploy,
  }
}
