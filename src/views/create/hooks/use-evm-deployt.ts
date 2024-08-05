import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { Address, Hash } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'
import { addrMap } from '@/contract/address'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { getDeployLogsAddr } from '@/utils/contract'
import { useAirdropParams } from './use-airdrop-params'
import { DeployFormParams } from './use-deploy'

export const useEvmDeploy = (
  onSuccess?: (
    parmas: DeployFormParams & {
      hash: Hash
      configure: string
      factory: Address
    }
  ) => void
) => {
  const { address, chainId = 0 } = useAccount()
  const { data: { value: balance = BI_ZERO } = {} } = useBalance({ address })
  const { bondingCurve } = addrMap[chainId] ?? {}

  const { data: evmCreationFee = BI_ZERO } = useReadContract({
    abi: bondingCurveAbiMap['0.1.0'], // TODO: match version
    address: bondingCurve!,
    chainId,
    functionName: 'creationFee_',
    query: { enabled: !!bondingCurve },
  })

  const {
    data: hash,
    isPending: isEvmSubmitting,
    error: evmSubmitError,
    writeContract,
    reset: resetEvmDeploy,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => CONTRACT_ERR.message(message, false),
    },
  })
  const {
    data,
    error: evmConfirmError,
    isLoading: isEvmConfirming,
    isSuccess: isEvmSuccess,
    isError: isEvmError,
  } = useWaitForTx({ hash })
  const evmDeployedAddr = useMemo(
    () => getDeployLogsAddr(data?.logs ?? []),
    [data]
  )

  const checkForDeploy = (
    config: string | undefined,
    airdropParams: undefined | any
  ) => {
    if (BigNumber(balance.toString()).lt(evmCreationFee.toString())) {
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

  const { getEvmParams } = useAirdropParams()

  const evmDeploy = async (params: DeployFormParams) => {
    const { name, ticker, chain, marketing } = params
    const { configure, distributorParams } = await getEvmParams(
      chain,
      marketing
    )
    if (!checkForDeploy(configure, distributorParams)) return
    if (!bondingCurve) return

    writeContract(
      {
        abi: bondingCurveAbiMap['0.1.0'],
        address: bondingCurve!,
        functionName: 'createToken',
        chainId,
        args: [[name, ticker], [], distributorParams!],
        value: evmCreationFee,
      },
      {
        onSuccess: (hash) =>
          onSuccess?.({
            ...params,
            hash,
            configure: configure!,
            factory: bondingCurve!,
          }),
      }
    )
  }

  return {
    evmDeployedAddr,
    evmHash: hash,
    evmSubmitError,
    evmConfirmError,
    evmCreationFee,
    isEvmSubmitting,
    isEvmConfirming,
    isEvmSuccess,
    isEvmError,
    evmDeploy,
    resetEvmDeploy,
  }
}
