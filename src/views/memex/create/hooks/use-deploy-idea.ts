import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { Address, formatEther, parseEther } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { reportException } from '@/errors'
import { CONTRACT_ERR } from '@/errors/contract'
import { getEvmAirdropParams } from '@/utils/contract'
import { Marketing } from '@/api/token/types'
import { useTokenConfig } from '@/hooks/use-token-config'
import { useChainsStore } from '@/stores/use-chains-store'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { memexFactoryAbiMap } from '@/contract/abi/memex/factory'
import { useInvite } from '@/hooks/use-invite'
import { useUserInfo } from '@/hooks/use-user-info'

export interface DeployIdeaParams {
  projectId: string
  tokenId: string | null
  name: string | undefined | null
  symbol: string | undefined | null
  marketing: Marketing[] | undefined
  initialBuyAmount: string
}

export const useDeployIdea = (
  chainName: string | undefined,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { chainId = 0 } = useAccount()
  const { configValue, memexFactoryAddr, memexFactoryVersion } =
    useTokenConfig(chainName)
  const { chainsMap } = useChainsStore()
  const { checkForChain } = useCheckAccount()
  const { getReferrals } = useInvite()
  const { refetchUserInfo } = useUserInfo()

  const deployConfig = {
    abi: memexFactoryAbiMap[memexFactoryVersion!],
    address: memexFactoryAddr as Address,
    chainId,
  }

  const {
    data: deployFee = '0',
    isLoading: isLoadingFee,
    refetch: refetchFee,
  } = useReadContract({
    ...deployConfig,
    functionName: 'ethAmount',
    query: {
      enabled: !!memexFactoryAddr && !!deployConfig.abi,
      select: (data) => formatEther(data),
    },
  })

  const {
    data: hash,
    isPending,
    writeContractAsync,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('memex.deploying')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reportException(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.confirming')),
    onSuccess: () => toast.success(t('memex.deploy-success')),
    onError: ({ message }) => {
      CONTRACT_ERR.message(message)
      reportException(message)
    },
    onFinally: () => {
      reset()
      refetchUserInfo()
      onFinally?.()
      toast.dismiss()
    },
  })

  const deploy = async ({
    projectId,
    name,
    symbol,
    initialBuyAmount,
    tokenId,
    marketing,
  }: DeployIdeaParams) => {
    if (!(await checkForChain(chainsMap[chainName || '']?.id))) return
    if (!memexFactoryAddr || !configValue) {
      CONTRACT_ERR.contractAddrNotFound()
      return
    }
    const hasInfo = !!name && !!symbol
    const totalFee = BigNumber(deployFee)
      .plus(initialBuyAmount || 0)
      .toFixed()
    const [referral] = await getReferrals()

    return writeContractAsync({
      ...deployConfig,
      functionName: 'create',
      args: [
        BigInt(projectId),
        parseEther(initialBuyAmount),
        referral,
        hasInfo ? [name, symbol] : [],
        [BigInt(tokenId || 0)], // 0 is not an error!!!!
        getEvmAirdropParams(configValue, marketing),
      ],
      // In the previous version, we did not need to pay "value".
      // @ts-ignore
      value: parseEther(totalFee),
    })
  }

  return {
    memexFactoryAddr,
    deployFee,
    isLoadingFee,
    isDeploying: isPending || isLoading,
    refetchFee,
    deploy,
  }
}
