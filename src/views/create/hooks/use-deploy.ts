import { useMemo, useState } from 'react'

import type { TokenNewReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useEvmDeploy } from './use-evm-deploy'
import { Network } from '@/constants/contract'
import { getNetwork } from '@/utils/contract'
import { useTvmDeploy } from './use-tvm-deploy'

export type DeployFormParams = Omit<
  TokenNewReq,
  'hash' | 'factory' | 'configure'
>

// Used to retry create token.
let cacheParams: DeployFormParams

export const useDeploy = () => {
  const [network, setNetwork] = useState(Network.Evm)
  const {
    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    updateToken,
  } = useCreateToken()

  const evmDeploy = useEvmDeploy((params) => createToken(params))
  // const svmDeploy = useSvmDeploy()
  const tvmDeploy = useTvmDeploy()

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
      [Network.Tvm]: tvmDeploy,
    }[network]
  }, [network, evmDeploy]) // TODO: add more deps...

  const deploy = async ({ marketing, ...params }: DeployFormParams) => {
    cacheParams = params // Exclude `marekting`
    const n = getNetwork(params.chain)

    setNetwork(n)
    if (n === Network.Evm) {
      return evmDeploy.deploy({ marketing, ...params })
    }
    if (n === Network.Svm) {
      // Solana
    }
    if (n === Network.Tvm) {
      // TON
      return tvmDeploy.deploy({ marketing, ...params })
    }
  }

  const retryCreate = () => {
    if (!cacheParams || !deployHash) {
      CONTRACT_ERR.retryCreateFailed()
      return
    }

    createToken({
      ...(cacheParams as Omit<TokenNewReq, 'hash'>),
      hash: deployHash,
    })
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
    createTokenError,
    deploy,
    resetDeploy,
    retryCreate,
  }
}
