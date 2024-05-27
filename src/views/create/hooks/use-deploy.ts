import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { first } from 'lodash'

import type { Address } from 'viem'
import type { TokenNewReq } from '@/api/token/types'

import { factoryAbi } from '../../../contract/abi/factory'
import { useCreateToken } from './use-create-token'
import { ApiCode } from '@/api/types'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { factoryAddress } from '@/contract/address'
import { useDeployConfig } from './use-deploy-config'

export const useDeploy = () => {
  const [backendErr, setBackendErr] = useState<unknown>(null)
  const [tokenId, setTokenId] = useState(-1)
  const { create } = useCreateToken()
  const {
    deployFee,
    deploySymbol,
    reserveRatio,
    nativeTokenAddress,
    routerAddress,
  } = useDeployConfig()

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
    // Submit hash to backend when contract submit success.
    const onSuccess = async (hash: Address) => {
      try {
        const { data, code, message } = await create({ ...params, hash })

        if (code !== ApiCode.Success) throw new Error(message)
        setTokenId(data?.coin_id!)
      } catch (error) {
        setBackendErr(error)
      }
    }
    return
    return writeContract(
      {
        abi: factoryAbi,
        address: factoryAddress.scroll,
        functionName: 'deploy',
        args: [
          reserveRatio,
          nativeTokenAddress.scroll,
          params.name,
          params.ticker,
          routerAddress.scroll,
        ],
        value: BigInt(deployFee),
      },
      { onSuccess }
    )
  }

  return {
    data,
    tokenId,
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
    backendErr,
    deploy,
    resetDeploy: reset,
  }
}
