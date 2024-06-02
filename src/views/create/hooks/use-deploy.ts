import { useAccount, useWriteContract } from 'wagmi'
import { first } from 'lodash'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { TokenNewReq } from '@/api/token/types'

import { factoryAbi } from '../../../contract/abi/factory'
import { useCreateToken } from './use-create-token'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useDeployConfig } from './use-deploy-config'
import { ca } from '@/contract/address'

export const useDeploy = () => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  const { createTokenData, createTokenError, create } = useCreateToken()
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
  const deployedAddress = first(data?.logs)?.address

  const deploy = (params: Omit<TokenNewReq, 'hash'>) => {
    // const contractAddr = chains.find((c) => c.name === params.chain)
    //   ?.contract_address as `0x${string}`

    // if (!contractAddr) {
    //   toast.error(t('not.supported.chain'))
    //   return
    // }

    const id = chainId as keyof typeof ca.reserveToken
    const nativeTokenAddr = ca.reserveToken[id]
    const routerAddr = ca.routerAddress[id]
    if (!nativeTokenAddr || !routerAddr) {
      toast.error(t('chain.empty'))
      return
    }

    const address = ca.factory[chainId as keyof typeof ca.factory]
    if (!address) {
      toast.error(t('addr.empty'))
      return
    }

    return writeContract(
      {
        abi: factoryAbi,
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

  return {
    data,
    deployedAddress,
    deployFee,
    deploySymbol,
    deployHash: hash,
    isDeploying: isPending || isLoading,
    isSubmitting: isPending,
    isConfirming: isLoading,
    isDeploySuccess: isSuccess,
    isDeployError: isError,
    submitError,
    confirmError,
    createTokenError,
    createTokenData,
    deploy,
    resetDeploy: reset,
  }
}
