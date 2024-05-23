import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { first } from 'lodash'

import type { Address } from 'viem'
import type { TokenNewReq } from '@/api/token/types'

import { factoryConfig } from './../../../contract/factory'
import { useCreateToken } from './use-token'
import { ApiCode } from '@/api'

const deployFee = 2000671350000000
const deploySymbol = 'ETH'

const reserveRatio = BigInt(800000)
const reserveTokenAddress = '0x5300000000000000000000000000000000000004'
const router = '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE'

export const useDeploy = () => {
  const [backendErr, setBackendErr] = useState<unknown>(null)
  const [tokenId, setTokenId] = useState(-1)
  const { create } = useCreateToken()

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
  } = useWaitForTransactionReceipt({ hash })
  const deployedAddress = first(data?.logs)?.address

  const deploy = (params: Omit<TokenNewReq, 'hash'>) => {
    // Submit hash to backend when contract submit success.
    const onSuccess = async (hash: Address) => {
      try {
        const { data, code, message } = await create({ ...params, hash })

        if (code !== ApiCode.Success) throw new Error(message)
        setTokenId(data.coin_id)
      } catch (error) {
        setBackendErr(error)
      }
    }

    return writeContract(
      {
        ...factoryConfig,
        functionName: 'deploy',
        args: [
          reserveRatio,
          reserveTokenAddress,
          params.name,
          params.ticker,
          router,
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
