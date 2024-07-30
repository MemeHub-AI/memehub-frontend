import { createElement, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { otherApi } from '@/api/other'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { TradeType } from '@/constants/trade'
import { TxStatus } from '@/components/toast/tx-status'

export interface Options {
  nativeAmount: string
  tokenAmount: string
  type: string
  hash?: `0x${string}`
  txUrl: string
  // TODO: We don't need it.
  setLoading?: (loading: boolean) => void
}

export const useTradeToast = () => {
  const [toastId, setToastId] = useState<string | number>('')
  const { chainName, tokenAddr } = useTradeSearchParams()

  const { mutateAsync, reset } = useMutation({
    mutationKey: [otherApi.getDiamondAmount.name],
    mutationFn: otherApi.getDiamondAmount,
  })

  const showToast = async (options: Options) => {
    const { txUrl, type, tokenAmount, nativeAmount, hash, setLoading } = options
    reset()

    const { data } = await mutateAsync({
      token_address: tokenAddr,
      chain: chainName,
      quote_amount: parseFloat(nativeAmount).toString(),
      operation: type,
    })

    const rewardAmount = data?.reward_amount
    const diamondQuantity =
      rewardAmount < 100 ? +rewardAmount.toFixed(4) : +rewardAmount.toFixed(2)

    setLoading?.(false)

    const id = toast(
      createElement(TxStatus, {
        isBuy: type === TradeType.Buy,
        txUrl: txUrl,
        tokenAmount,
        hash: hash,
        nativeTokenAmount: nativeAmount,
        diamondQuantity,
        getToastId: () => id,
      }),
      {
        position: 'bottom-left',
        className: 'w-100 moving-element',
        duration: 1200_000,
        style: {
          transition:
            'transformY 0s,transformX .4s,opacity .4s,height .4s,box-shadow .2s',
        },
      }
    )
    setToastId(id)

    return id
  }

  const dismissDiamond = () => {
    toast.dismiss(toastId)
  }

  return {
    showToast,
    dismissDiamond,
  }
}
