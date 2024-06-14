import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { TokenNewReq } from '@/api/token/types'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCreateToken } from './use-create-token'
import { DEPLOY_FEE, getBondConfig } from '@/contract/v2/config/bond'

let cacheParams: Omit<TokenNewReq, 'hash'>

export const useDeployV2 = () => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  const { createTokenData, createTokenError, isCreatingToken, create } =
    useCreateToken()

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

  const deploy = (params: Omit<TokenNewReq, 'hash'>) => {
    cacheParams = params
    if (!chainId) {
      toast.error(t('deploy.chain.empty'))
      return
    }

    const config = getBondConfig(chainId)
    if (!config) {
      toast.error(t('deploy.config.empty'))
      return
    }
    const [bondConfig, bondParams] = config

    console.log('v2 deploy', bondConfig)
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
      toast.error(t('cannot-retry'))
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
