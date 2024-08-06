import { useMemo, useState } from 'react'
import { formatEther } from 'viem'

import type { TokenNewReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { CONTRACT_ERR } from '@/errors/contract'
import { useEvmDeploy } from './use-evm-deploy'
import { Platform } from '@/constants/contract'
import { getPaltform } from '@/utils/contract'

export type DeployFormParams = Omit<
  TokenNewReq,
  'hash' | 'factory' | 'configure'
>

// Used to retry create token.
let cacheParams: DeployFormParams

export const useDeploy = () => {
  const [platform, setPlatform] = useState(Platform.Evm)
  const {
    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    updateToken,
  } = useCreateToken()

  const evmDeploy = useEvmDeploy((params) => createToken(params))
  // const solDeploy = useSolDeploy()
  // const tonDeploy = useTonDeploy()

  const {
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    resetDeploy,
  } = useMemo(() => {
    return {
      [Platform.Evm]: {
        ...evmDeploy,
        deployFee: formatEther(evmDeploy.deployFee),
      },
      [Platform.Sol]: evmDeploy, // TODO: should be `solDeploy`
      [Platform.Ton]: evmDeploy, // TODO: should be `tonDeploy`
    }[platform]
  }, [platform, evmDeploy]) // TODO: add more deps...

  const deploy = async ({ marketing, ...params }: DeployFormParams) => {
    cacheParams = params // Exclude `marekting`
    const p = getPaltform(params.chain)

    setPlatform(p)
    if (p === Platform.Evm) {
      return evmDeploy.deploy({ marketing, ...params })
    }
    if (p === Platform.Sol) {
    }
    if (p === Platform.Ton) {
    }
  }

  const retryCreate = () => {
    if (!cacheParams || !deployHash) {
      CONTRACT_ERR.retryCreateFailed()
      return
    }

    createToken({
      ...(cacheParams as Omit<TokenNewReq, 'hash'>),
      hash: deployHash,
    })
  }

  return {
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploying: isSubmitting || isConfirming,
    isCreatingToken,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    createTokenData,
    createTokenError,
    deploy,
    resetDeploy,
    retryCreate,
  }
}
