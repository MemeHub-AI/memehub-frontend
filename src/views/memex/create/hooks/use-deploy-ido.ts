import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { formatEther, parseEther } from 'viem'
import { toast } from 'sonner'
import dayjs from 'dayjs'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { memexFactoryAbi } from '@/contract/abi/memex/factory'
import { addrMap } from '@/contract/address'
import { reportException } from '@/errors'
import { CONTRACT_ERR } from '@/errors/contract'
import { getEvmAirdropParams } from '@/utils/contract'
import { Marketing } from '@/api/token/types'
import { useCreateToken } from '@/views/create/hooks/use-create-token'

export const useDeployIdo = (onFinally?: () => void) => {
  const { t } = useTranslation()
  const { chainId = 0 } = useAccount()
  const { configValue } = useCreateToken()

  const { memexFactory } = addrMap[chainId] ?? {}
  const deployConfig = {
    abi: memexFactoryAbi,
    address: memexFactory!,
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
      enabled: !!memexFactory,
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
    onLoading: () => toast.loading(t('tx.confirmation')),
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
    name: string | undefined,
    symbol: string | undefined,
    marketing: Marketing[] | undefined
  ) => {
    if (!memexFactory || !configValue) {
      CONTRACT_ERR.configNotFound()
      return
    }
    const hasInfo = !!name && !!symbol

    return writeContractAsync({
      ...deployConfig,
      functionName: 'create',
      args: [
        // TODO: remove endTime
        [BigInt(dayjs().unix()), BigInt(dayjs().unix() + 7200)],
        hasInfo ? [name, symbol] : [],
        [BigInt(projectId)],
        getEvmAirdropParams(configValue, marketing),
      ],
      value: parseEther(deployFee),
    })
  }

  return {
    deployFee,
    isLoadingFee,
    isDeploying: isPending || isLoading,
    refetchFee,
    deploy,
  }
}
