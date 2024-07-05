import { useMemo } from 'react'
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { Hash, formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { Marketing, TokenNewReq } from '@/api/token/types'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useDeployV1 } from './use-deploy-v1'
import { useDeployV2 } from './use-deploy-v2'
import { useDeployV3 } from './use-deploy-v3'
import { getDeployLogAddr, versionOf } from '@/utils/contract'
import { ContractVersion } from '@/constants/contract'
import { logger } from '@/utils/log'
import { getV3Config } from '@/contract/v3/config'
import { BI_ZERO } from '@/constants/number'

export interface DeployParams {
  name: string
  ticker: string
  marketing?: Marketing[] | undefined
  onSuccess?: (hash: Hash) => void
}

// Used for retry create.
let cacheParams: Omit<TokenNewReq, 'hash'>

export const useDeploy = () => {
  const { createTokenData, createTokenError, isCreatingToken, create } =
    useCreateToken()
  const { address, chainId } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const balance = String(balanceData?.value ?? 0)

  const { bondingCurveConfig } = getV3Config(chainId)

  const { data: creationFee = BI_ZERO } = useReadContract({
    ...bondingCurveConfig!,
    chainId,
    functionName: 'creationFee_',
    query: { enabled: !!bondingCurveConfig },
  })

  const {
    data: hash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset: resetDeploy,
  } = useWriteContract({
    mutation: {
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })
  const {
    data,
    error: confirmError,
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTx({ hash })
  const deployLogAddr = useMemo(
    () => getDeployLogAddr(data?.logs ?? []),
    [data]
  )

  const { deployV1 } = useDeployV1(writeContract)
  const { deployV2 } = useDeployV2(writeContract)
  const { deployV3 } = useDeployV3(writeContract, creationFee)

  const deploy = async (params: Omit<TokenNewReq, 'hash'>) => {
    cacheParams = params

    const deployParams = {
      ...params,
      onSuccess: (hash: string) => create({ ...params, hash }),
    }

    if (BigNumber(balance).lt(creationFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return
    }

    const vIs = versionOf(params.version)

    logger('deploy', deployParams, balance, creationFee)
    if (vIs(ContractVersion.V1)) return deployV1(deployParams)
    if (vIs(ContractVersion.V2)) return deployV2(deployParams)
    if (vIs(ContractVersion.V3)) return deployV3(deployParams)
  }

  const retryCreate = () => {
    if (!cacheParams || !hash) {
      CONTRACT_ERR.retryCreateFailed()
      return
    }

    create({ ...cacheParams, hash })
  }

  return {
    data,
    deployFee: formatEther(creationFee),
    deployHash: hash,
    deployLogAddr,
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
    resetDeploy,
    retryCreate,
  }
}
