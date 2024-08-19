import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { Address, formatEther, parseEther } from 'viem'
import { toast } from 'sonner'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { memexFactoryAbi } from '@/contract/abi/memex/factory'
import { reportException } from '@/errors'
import { CONTRACT_ERR } from '@/errors/contract'
import { getEvmAirdropParams } from '@/utils/contract'
import { Marketing } from '@/api/token/types'
import { useTokenConfig } from '@/hooks/use-token-config'

export const useDeployIdea = (
  chainName: string | undefined,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { chainId = 0 } = useAccount() // TODO/memex: multi chain
  const { configValue, memexFactoryAddr } = useTokenConfig(chainName)

  const deployConfig = {
    abi: memexFactoryAbi,
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
      enabled: !!memexFactoryAddr,
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
    onFillay: () => {
      toast.dismiss()
      reset()
      onFinally?.()
    },
  })

  const deploy = async (
    projectId: string,
    tokenId: string | null,
    name: string | undefined,
    symbol: string | undefined,
    marketing: Marketing[] | undefined
  ) => {
    if (!memexFactoryAddr || !configValue) {
      CONTRACT_ERR.configNotFound()
      return
    }
    const hasInfo = !!name && !!symbol

    return writeContractAsync({
      ...deployConfig,
      functionName: 'create',
      args: [
        BigInt(projectId),
        hasInfo ? [name, symbol] : [],
        [BigInt(tokenId || 0)],
        getEvmAirdropParams(configValue, marketing),
      ],
      value: parseEther(deployFee),
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
