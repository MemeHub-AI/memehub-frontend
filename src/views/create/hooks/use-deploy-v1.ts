import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import type { TokenNewReq } from '@/api/token/types'

import { v1FactoryAbi } from '../../../contract/v1/abi/factory'
import { useCreateToken } from './use-create-token'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { v1Addr } from '@/contract/v1/address'
import { v1FactoryParams } from '@/contract/v1/config/factory'
import { commonAddr } from '@/contract/address'

let cacheParams: Omit<TokenNewReq, 'hash'>

export const useDeployV1 = () => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  const { createTokenData, createTokenError, isCreatingToken, create } =
    useCreateToken()

  const {
    data: hash,
    isPending,
    error: submitError,
    writeContract,
    reset,
  } = useWriteContract()
  const {
    data,
    error: confirmError,
    isSuccess,
    isLoading,
    isError,
  } = useWaitForTx({ hash })

  const deploy = (params: Omit<TokenNewReq, 'hash'>) => {
    cacheParams = params
    if (!chainId) return

    const id = chainId as keyof typeof commonAddr
    const { reserveToken, router } = commonAddr[id]
    if (isEmpty(reserveToken) || isEmpty(router)) {
      toast.error(t('chain.empty'))
      return
    }

    const address = v1Addr.factory[chainId as keyof typeof v1Addr.factory]
    if (isEmpty(address)) {
      toast.error(t('addr.empty'))
      return
    }

    return writeContract(
      {
        abi: v1FactoryAbi,
        address,
        functionName: 'deploy',
        args: [
          v1FactoryParams.reserveRatio,
          reserveToken,
          params.name,
          params.ticker,
          router,
        ],
        value: v1FactoryParams.deployFee,
      },
      {
        // Submit hash to backend when contract submit success.
        onSuccess: (hash) => create({ ...params, hash }),
      }
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
    isDeploying: isPending || isLoading || isCreatingToken,
    isSubmitting: isPending,
    isConfirming: isLoading,
    isCreatingToken,
    isDeploySuccess: isSuccess,
    isDeployError: isError,
    submitError,
    confirmError,
    createTokenError,
    createTokenData,
    deploy,
    resetDeploy: reset,
    retryCreate,
  }
}
