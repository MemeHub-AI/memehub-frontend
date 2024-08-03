import { useMemo } from 'react'
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { TokenNewReq } from '@/api/token/types'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { addrMap } from '@/contract/address'
import { useAirdropParams } from './use-airdrop-params'
import { BI_ZERO } from '@/constants/number'
import { getDeployLogsAddr } from '@/utils/contract'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'

type FormParams = Omit<TokenNewReq, 'hash' | 'factory' | 'configure'>

// Used to retry create token.
let cacheParams: FormParams

export const useDeploy = () => {
  const {
    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    updateToken,
  } = useCreateToken()
  const { address, chainId = 0 } = useAccount()
  const { data: { value: balance = BI_ZERO } = {} } = useBalance({ address })
  const { bondingCurve } = addrMap[chainId] ?? {}

  const {
    data: hash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => CONTRACT_ERR.message(message, false),
    },
  })
  const {
    data,
    error: confirmError,
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTx({ hash })
  const deployedAddr = useMemo(
    () => getDeployLogsAddr(data?.logs ?? []),
    [data]
  )

  const { data: creationFee = BI_ZERO } = useReadContract({
    abi: bondingCurveAbiMap['0.1.0'], // TODO: match version
    address: bondingCurve!,
    chainId,
    functionName: 'creationFee_',
    query: { enabled: !!bondingCurve },
  })
  const { getParams } = useAirdropParams()

  const checkForDeploy = (
    config: string | undefined,
    airdropParams: undefined | any
  ) => {
    if (BigNumber(balance.toString()).lt(creationFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return false
    }
    if (!bondingCurve || BigNumber(chainId).isZero()) {
      CONTRACT_ERR.configNotFound()
      return false
    }
    if (!airdropParams || !config) {
      CONTRACT_ERR.marketParamsNotFound()
      return false
    }

    return true
  }

  const deploy = async ({ marketing, ...params }: FormParams) => {
    cacheParams = params // Exclude `marekting`
    const { chain, name, ticker } = params

    const { configure, distributorParams } = await getParams(chain, marketing)
    if (!checkForDeploy(configure, distributorParams)) return
    if (!bondingCurve) return

    writeContract(
      {
        abi: bondingCurveAbiMap['0.1.0'],
        address: bondingCurve!,
        functionName: 'createToken',
        chainId,
        args: [[name, ticker], [], distributorParams!],
        value: creationFee,
      },
      {
        onSuccess: (hash) =>
          createToken({
            ...params,
            factory: bondingCurve!,
            configure: configure!,
            hash,
          }),
      }
    )
  }

  const retryCreate = () => {
    if (!cacheParams || !hash) {
      CONTRACT_ERR.retryCreateFailed()
      return
    }

    createToken({ ...(cacheParams as Omit<TokenNewReq, 'hash'>), hash })
  }

  return {
    data,
    deployFee: formatEther(creationFee),
    deployHash: hash,
    deployedAddr,
    isDeploying: isSubmitting || isConfirming,
    isSubmitting,
    isConfirming,
    isCreatingToken,
    isDeploySuccess: isSuccess,
    isDeployError: isError,
    submitError: submitError,
    confirmError,
    createTokenData,
    createTokenError,
    deploy,
    resetDeploy: reset,
    retryCreate,
  }
}
