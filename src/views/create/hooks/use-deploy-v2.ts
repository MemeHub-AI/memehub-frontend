import { useAccount, useWriteContract } from 'wagmi'

import type { TokenNewReq } from '@/api/token/types'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCreateToken } from './use-create-token'
import { DEPLOY_FEE, getBondConfig } from '@/contract/v2/config/bond'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainInfo } from '@/hooks/use-chain-info'

let cacheParams: Omit<TokenNewReq, 'hash'>

export const useDeployV2 = () => {
  const { chainId, chainName } = useChainInfo()
  const {
    createTokenData,
    createTokenError,
    isCreatingToken,
    create,
    getMerkleRoot,
  } = useCreateToken()

  const {
    data: hash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset,
  } = useWriteContract()
  const {
    data,
    error: confirmError,
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTx({ hash })

  const genMerkleRoot = () => {}

  const deploy = async (params: Omit<TokenNewReq, 'hash'>) => {
    cacheParams = params

    const config = getBondConfig(chainId)
    if (!chainId || !config) {
      CONTRACT_ERR.unsupport()
      return
    }
    const [bondConfig, bondParams] = config

    writeContract(
      {
        ...bondConfig,
        functionName: 'createToken',
        args: [{ name: params.name, symbol: params.ticker }, bondParams],
        value: DEPLOY_FEE,
      },
      { onSuccess: (hash) => create({ ...params, hash }) }
    )
  }

  const retryCreate = () => {
    if (!cacheParams || !hash) {
      CONTRACT_ERR.retryCreate()
      return
    }

    create({ ...cacheParams, hash })
  }

  return {
    data,
    deployHash: hash,
    isDeploying: isSubmitting || isConfirming,
    isSubmitting,
    isConfirming,
    isCreatingToken,
    isDeploySuccess: isSuccess,
    isDeployError: isError,
    submitError,
    confirmError,
    createTokenData,
    createTokenError,
    deploy,
    resetDeploy: reset,
    retryCreate,
  }
}
