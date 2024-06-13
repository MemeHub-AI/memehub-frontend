import { useAccount, useWriteContract } from 'wagmi'

import type { TokenNewReq } from '@/api/token/types'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { v2BondAbi } from '@/contract/v2/abi/bond'
import { v2Addr } from '@/contract/v2/address'
import { v2BondParams } from '@/contract/v2/params/bond'
import { commonAddr } from '@/contract/address'
import { useCreateToken } from './use-create-token'

export const useDeployV2 = () => {
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
    const chainId = 97
    const { deployFee, ...bondParams } = v2BondParams

    console.log('v2 deploy', params)

    writeContract({
      abi: v2BondAbi,
      address: v2Addr[chainId].bond,
      functionName: 'createToken',
      args: [
        { name: params.name, symbol: params.ticker },
        {
          ...bondParams,
          reserveToken: commonAddr[chainId].reserveToken,
          router: commonAddr[chainId].router,
        },
      ],
      value: deployFee,
    })
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
