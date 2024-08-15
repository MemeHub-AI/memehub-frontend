import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Address } from 'viem'
import { useChainId, useWriteContract } from 'wagmi'

import { memexApi } from '@/api/memex'
import { REQUEST_ERR } from '@/errors/request'
import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useIdeaDetails } from '../../idea/hooks/use-idea-details'
import { Marketing } from '@/api/token/types'
import { getEvmAirdropParams } from '@/utils/contract'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTokenConfig } from '@/hooks/use-token-config'

export const useUpdateIdea = (hashId: string | undefined) => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { details } = useIdeaDetails(hashId)
  const { configValue } = useTokenConfig()

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('tx.submitting')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.confirmation')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => toast.success(t('update-success')),
    onFillay: () => {
      toast.dismiss()
      reset()
    },
  })

  const {
    isPending: isPendingInfo,
    mutateAsync,
    reset: resetUpdate,
  } = useMutation({
    mutationKey: [memexApi.updateIdea.name, hashId],
    mutationFn: memexApi.updateIdea,
    onMutate: () => toast.loading(t('updating')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: ({ message }) => {
      REQUEST_ERR.message(message)
      resetUpdate()
    },
  })

  const update = async ({
    marketing,
    ...params
  }: Parameters<typeof memexApi.updateIdea>[0] & {
    marketing: Marketing[] | undefined
  }) => {
    if (!configValue) {
      CONTRACT_ERR.configNotFound()
      return
    }

    try {
      const { data } = await mutateAsync(params)
      if (!data?.hash || !details?.ido_address) {
        toast.error(t('update-failed'))
        return
      }

      writeContract({
        abi: memexIdoAbi,
        address: details.ido_address as Address,
        chainId,
        functionName: 'setTokenInfo',
        args: [
          [params.name!, params.symbol!],
          [BigInt(data.hash)],
          getEvmAirdropParams(configValue, marketing),
        ],
      })
    } catch (error) {}
  }

  return {
    isUpdating: isPending || isLoading || isPendingInfo,
    update,
  }
}
