import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { TokenNewReq } from '@/api/token/types'

import { v1FactoryAbi } from '../../../contract/v1/abi/factory'
import { useCreateToken } from './use-create-token'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useDeployConfig } from './use-deploy-config'
import { addressesV1 } from '@/contract/v1/addresses'

let cacheParams: Omit<TokenNewReq, 'hash'>

export const useDeploy = () => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  const { createTokenData, createTokenError, isCreatingToken, create } =
    useCreateToken()
  const { deployFee, deploySymbol, reserveRatio } = useDeployConfig()

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
    // const contractAddr = chains.find((c) => c.name === params.chain)
    //   ?.contract_address as `0x${string}`

    // if (!contractAddr) {
    //   toast.error(t('not.supported.chain'))
    //   return
    // }

    const id = chainId as keyof typeof addressesV1.reserveToken
    const nativeTokenAddr = addressesV1.reserveToken[id]
    const routerAddr = addressesV1.routerAddress[id]
    if (!nativeTokenAddr || !routerAddr) {
      toast.error(t('chain.empty'))
      return
    }

    const address =
      addressesV1.factory[chainId as keyof typeof addressesV1.factory]
    if (!address) {
      toast.error(t('addr.empty'))
      return
    }

    return writeContract(
      {
        abi: v1FactoryAbi,
        address,
        functionName: 'deploy',
        args: [
          reserveRatio,
          nativeTokenAddr,
          params.name,
          params.ticker,
          routerAddr,
        ],
        value: BigInt(deployFee),
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
    deployFee,
    deploySymbol,
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
