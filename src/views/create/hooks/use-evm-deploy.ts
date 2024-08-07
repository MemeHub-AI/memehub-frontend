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
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { getDeployLogsAddr } from '@/utils/contract'
import { DeployFormParams } from './use-deploy'
import { deployEvmAirdropParams, deployVersion } from '@/config/deploy'
import { useCreateToken } from './use-create-token'
import { Marketing, MarketType } from '@/api/token/types'
import { AirdropType } from '@/enums/airdrop'

export const useEvmDeploy = () => {
  const { address, chainId = 0 } = useAccount()
  const { data: { value: balance = BI_ZERO } = {} } = useBalance({ address })
  const { bcAddress, configValue } = useCreateToken()
  const bcConfig = {
    abi: bondingCurveAbiMap[deployVersion],
    address: bcAddress!,
    chainId,
  }

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

  const getAirdropParams = (marketing: Marketing[] | undefined) => {
    const params = { ...deployEvmAirdropParams }
    const {
      distributionRatioKol,
      walletCountKol,
      distributionRatioCommunity,
      walletCountCommunity,
    } = configValue!
    const hasKol = marketing?.find((m) => m.type === MarketType.Kol)
    const hasCmnt = marketing?.find((m) => m.type === MarketType.Community)

    if (hasKol) {
      params.isDistribution = true
      params.distributionRatioKol = distributionRatioKol * 100
      params.walletCountKol = walletCountKol
      params.kolFlag = AirdropType.All
    }
    if (hasCmnt) {
      params.isDistribution = true
      params.distributionRatioCommunity = distributionRatioCommunity * 100
      params.walletCountCommunity = walletCountCommunity
      params.CommunityFlag = AirdropType.All
    }

    return params
  }

  const checkForDeploy = () => {
    if (BigNumber(balance.toString()).lt(deployFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return false
    }
    if (!bcAddress || BigNumber(chainId).isZero()) {
      CONTRACT_ERR.configNotFound()
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
      args: [[name, symbol], [BigInt(tokenId)], getAirdropParams(marketing)],
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
