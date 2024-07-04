import { createElement, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { otherApi } from '@/api/other'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { useTokenContext } from '@/contexts/token'
import { TxSuccess } from '@/components/toast/tx-success'
import { TradeType } from '@/constants/trade'
export interface Options {
  nativeAmount: string
  tokenAmount: string
  type: string
  hash?: `0x${string}`
  txUrl: string
}

export const useToastDiamond = () => {
  const [toastId, setToastId] = useState<string | number>('')
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { tokenInfo } = useTokenContext()

  const { mutateAsync, reset } = useMutation({
    mutationKey: [otherApi.getDiamondAmount.name],
    mutationFn: otherApi.getDiamondAmount,
  })

  const toastDiamond = async (
    amount: string,
    operation: string,
    options: Options
  ) => {
    const { txUrl, type, tokenAmount, nativeAmount } = options
    reset()
    const { data } = await mutateAsync({
      token_address: tokenAddr,
      chain: chainName,
      quote_amount: amount,
      operation,
    })

    const id = toast(
      createElement(TxSuccess, {
        isBuy: type === TradeType.Buy,
        txUrl: txUrl,
        tokenAmount,
        nativeTokenAmount: nativeAmount,
        diamondQuantity: data?.reward_amount,
      }),
      { position: 'bottom-left', className: 'w-100', duration: 120_000 }
    )
    setToastId(id)

    return id
  }

  const dismissDiamond = () => {
    // toast.dismiss(toastId)
  }

  return {
    toastDiamond,
    dismissDiamond,
  }
}
