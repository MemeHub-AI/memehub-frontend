import { useMemo, useState } from 'react'

import type { TokenNewReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { useEvmDeploy } from './use-evm-deploy'
import { Network } from '@/constants/contract'
import { useChainsStore } from '@/stores/use-chains-store'
import { deployErr } from '@/errors/deploy'

export type DeployFormParams = Omit<
  TokenNewReq,
  'factory_address' | 'airdrop_address'
>

export const useDeploy = () => {
  const [network, setNetwork] = useState(Network.Evm)
  const { createTokenData, isCreatingToken, createToken } = useCreateToken()
  const { chainsMap } = useChainsStore()

  const evmDeploy = useEvmDeploy()
  // const svmDeploy = useSvmDeploy()
  // const tvmDeploy = useTvmDeploy()

  const {
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
      [Network.Svm]: evmDeploy, // TODO: should be `svmDeploy`
      [Network.Tvm]: evmDeploy, // TODO: should be `tvmDeploy`
    }[network]
  }, [network, evmDeploy]) // TODO: add more deps...

  const deploy = async (params: DeployFormParams) => {
    const tokenId = await createToken(params)
    if (!tokenId) return deployErr.createFailed()

    const { network } = chainsMap[params.chain] ?? {}
    if (!network) return deployErr.networkNotFound()

    setNetwork(network!)
    if (network === Network.Evm) {
      return evmDeploy.deploy({ ...params, tokenId: tokenId! })
    }
    if (network === Network.Svm) {
      // Solana
    }
    if (network === Network.Tvm) {
      // TON
    }
  }

  return {
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
