import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Address, parseEther } from 'viem'
import { useChainId, useWriteContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { memexApi } from '@/api/memex'
import { REQUEST_ERR } from '@/errors/request'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useIdeaDetails } from '../../idea/hooks/use-idea-details'
import { getEvmAirdropParams } from '@/utils/contract'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTokenConfig } from '@/hooks/use-token-config'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { memexIdoAbiMap } from '@/contract/abi/memex/ido'
import { useIdeaInitialBuy } from '../details/hooks/use-idea-initial-buy'

interface Options {
  showSuccessTips?: boolean
  onSuccess?: () => void
  onContractSuccess?: () => void
}

export const useUpdateIdea = (
  hashId: string | undefined,
  { showSuccessTips = false, onSuccess, onContractSuccess }: Options = {}
) => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { details } = useIdeaDetails(hashId)
  const { query } = useRouter()
  const { configValue } = useTokenConfig(details?.chain)
  const { checkForChain } = useCheckAccount()
  const { initialBuyAmount, initialBuyMax } = useIdeaInitialBuy(
    details?.chain || (query.chain as string),
    details?.memex_version,
    details?.ido_address
  )

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
    onLoading: () => toast.loading(t('tx.confirming')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => toast.success(t('update-success')),
    onFinally: () => {
      reset()
      onContractSuccess?.()
      toast.dismiss()
    },
  })

  const {
    isPending: isPendingInfo,
    mutateAsync: update,
    reset: resetUpdate,
  } = useMutation({
    mutationKey: [memexApi.updateIdea.name, hashId],
    mutationFn: memexApi.updateIdea,
    onMutate: () => toast.loading(t('updating')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onSuccess: () => {
      if (showSuccessTips) toast.success(t('update-success'))
      onSuccess?.()
    },
    onError: ({ message }) => {
      REQUEST_ERR.message(message)
      resetUpdate()
    },
  })

  const updateWithContract = async (
    params: Parameters<typeof memexApi.updateIdea>[0] & {
      initialBuyAmount: string
    }
  ) => {
    const config = {
      abi: memexIdoAbiMap[details?.memex_version!],
      address: details?.ido_address as Address,
      chainId,
    }

    if (!(await checkForChain(chainId))) return
    if (!configValue || !config.abi || !config.address) {
      CONTRACT_ERR.configNotFound()
      return
    }

    const inputBuyAmount = BigNumber(params.initialBuyAmount)

    if (inputBuyAmount.lt(initialBuyAmount)) {
      toast.error(t('initial-buy.lt'))
      return
    }

    try {
      const { data } = await update(params)
      if (!data?.coin_id || !details?.ido_address) {
        CONTRACT_ERR.configNotFound('coin_id, ido_address')
        return
      }

      const value = inputBuyAmount.minus(initialBuyAmount).toFixed()

      writeContract({
        ...config,
        functionName: 'setTokenInfo',
        args: [
          [params.name!, params.symbol!],
          [BigInt(data.coin_id)],
          getEvmAirdropParams(configValue, params.airdrop_marketing),
        ],
        value: parseEther(value),
      })
    } catch (error) {
      toast.dismiss()
    }
  }

  return {
    isUpdating: isPending || isLoading || isPendingInfo,
    update,
    updateWithContract,
    initialBuyAmount,
    initialBuyMax,
  }
}
