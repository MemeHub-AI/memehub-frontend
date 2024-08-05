import { formatEther } from 'viem'

import { TokenNewReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useEvmDeploy } from './use-evm-deployt'

export type DeployFormParams = Omit<
  TokenNewReq,
  'hash' | 'factory' | 'configure'
>

// Used to retry create token.
let cacheParams: DeployFormParams

export const useDeploy = () => {
  const {
    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    updateToken,
  } = useCreateToken()
  const {
    evmHash,
    evmCreationFee,
    evmDeployedAddr,
    evmSubmitError,
    evmConfirmError,
    isEvmSubmitting,
    isEvmConfirming,
    isEvmSuccess,
    isEvmError,
    evmDeploy,
    resetEvmDeploy,
  } = useEvmDeploy((params) => createToken(params))

  const deployFee = formatEther(evmCreationFee)
  const deployHash = evmHash
  const deployedAddr = evmDeployedAddr
  const isSubmitting = isEvmSubmitting
  const isConfirming = isEvmConfirming
  const isDeploying = isSubmitting || isConfirming
  const isDeploySuccess = isEvmSuccess
  const isDeployError = isEvmError
  const submitError = evmSubmitError
  const confirmError = evmConfirmError
  const resetDeploy = resetEvmDeploy

  const deploy = async ({ marketing, ...params }: DeployFormParams) => {
    cacheParams = params // Exclude `marekting`

    return evmDeploy({ marketing, ...params })
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
    isDeploying,
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
