import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { formatEther } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { getDeployLogsAddr, getEvmAirdropParams } from '@/utils/contract'
import { DeployFormParams } from './use-deploy'
import { useTokenConfig } from '@/hooks/use-token-config'

export const useEvmDeploy = () => {
  const { address, chainId = 0 } = useAccount()
  const { data: { value: balance = BI_ZERO } = {} } = useBalance({ address })
  const { configValue, bcAddress, bcVersion } = useTokenConfig()
  const bcConfig = {
    abi: bcAbiMap[bcVersion!],
    address: bcAddress!,
    chainId,
  } as const

  const { data: deployFee = BI_ZERO } = useReadContract({
    ...bcConfig,
    functionName: 'creationFee_',
    query: { enabled: !!bcAddress },
  })

  const {
    data: hash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset: resetDeploy,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => CONTRACT_ERR.message(message, false),
    },
  })
  const {
    data: { logs } = {},
    error: confirmError,
    isLoading: isConfirming,
    isSuccess: isDeploySuccess,
    isError: isDeployError,
  } = useWaitForTx({ hash })
  const deployedAddr = useMemo(() => getDeployLogsAddr(logs), [logs])

  const checkForDeploy = () => {
    if (BigNumber(balance.toString()).lt(deployFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return false
    }
    if (!bcConfig.address || !bcConfig.abi || bcConfig.chainId <= 0) {
      CONTRACT_ERR.configNotFound('address/abi/chain id')
      return false
    }
    if (!configValue) {
      CONTRACT_ERR.marketParamsNotFound()
      return false
    }

    return true
  }

  const deploy = async ({
    name,
    symbol,
    tokenId,
    marketing,
  }: DeployFormParams & { tokenId: string }) => {
    if (!checkForDeploy()) return

    writeContract({
      ...bcConfig,
      functionName: 'createToken',
      args: [
        [name, symbol],
        [BigInt(tokenId)],
        getEvmAirdropParams(configValue!, marketing),
      ],
      value: deployFee,
    })
  }

  return {
    deployFee: formatEther(deployFee),
    deployHash: hash,
    deployedAddr,
    submitError,
    confirmError,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    deploy,
    resetDeploy,
  }
}
