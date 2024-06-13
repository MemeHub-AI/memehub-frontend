import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { TokenNewReq } from '@/api/token/types'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCreateToken } from './use-create-token'
import { getBondConfig } from '@/contract/v2/config/bond'

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
    if (!chainId) {
      toast.error(t('deploy.chain.empty'))
      return
    }

    const [bondConfig, bondParams] = getBondConfig(chainId)
    if (!bondConfig || !bondParams) {
      toast.error(t('deploy.config.empty'))
      return
    }
    const { deployFee, ...restParams } = bondParams

    console.log('v2 deploy', bondConfig)
    writeContract(
      {
        ...bondConfig,
        functionName: 'createToken',
        args: [{ name: params.name, symbol: params.ticker }, restParams],
        value: deployFee,
      },
      { onSuccess: (hash) => create({ ...params, hash }) }
    )
  }

  const retryCreate = () => {}

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
