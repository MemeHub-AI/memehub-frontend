import { createElement, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type Hash } from 'viem'

import { otherApi } from '@/api/other'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { TradeType } from '@/constants/trade'
import { TxStatus } from '@/components/trade-toast/tx-status'
import { useChainsStore } from '@/stores/use-chains-store'

interface Options {
  hash: Hash
  txUrl: string
  type: TradeType | ''
  reserveLabel: string
  tokenLabel: string
}

export const useTradeToast = () => {
  const toastId = useRef<string | number>('')
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainsMap } = useChainsStore()

  const { mutateAsync, reset } = useMutation({
    mutationKey: [otherApi.getDiamondAmount.name],
    mutationFn: otherApi.getDiamondAmount,
  })

  const getRewardAmount = async (
    type: TradeType | '',
    reserveAmount: string
  ) => {
    const { data } = await mutateAsync({
      token_address: tokenAddr,
      chain: chainName,
      operation: type,
      quote_amount: parseFloat(reserveAmount).toString(),
    }).catch(() => ({ data: { reward_amount: 0 } }))

    const amount = data?.reward_amount
    const rewardAmount = Number(
      amount < 100 ? amount.toFixed(4) : amount.toFixed(2)
    )

    return rewardAmount
  }

  const showToast = async (options: Options) => {
    const { type, tokenLabel, reserveLabel, hash, txUrl } = options
    reset()
    toastId.current = toast(
      createElement(TxStatus, {
        hash,
        txUrl,
        isBuy: type === TradeType.Buy,
        tokenLabel,
        reserveLabel,
        rewardAmount: await getRewardAmount(type, reserveLabel),
        getToastId: () => toastId.current,
      }),
      {
        position: 'bottom-left',
        className: 'w-100 moving-element',
        duration: 1800_000, // 30m
        style: {
          transition:
            'transformY 0s,transformX .4s,opacity .4s,height .4s,box-shadow .2s',
        },
      }
    )
    return toastId.current
  }

  const dismissToast = () => {
    toast.dismiss(toastId.current)
  }

  return {
    showToast,
    dismissToast,
  }
}
