import { createElement, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { otherApi } from '@/api/other'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { TradeSuccessCard } from '@/views/token/components/trade-success-card'
import { useTokenContext } from '@/contexts/token'

export const useToastDiamond = () => {
  const [toastId, setToastId] = useState<string | number>('')
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { tokenInfo } = useTokenContext()

  const { mutateAsync, reset } = useMutation({
    mutationKey: [otherApi.getDiamondAmount.name],
    mutationFn: otherApi.getDiamondAmount,
  })

  const toastDiamond = async (amount: string, operation: string) => {
    reset()
    const { data } = await mutateAsync({
      token_address: tokenAddr,
      chain: chainName,
      base_amount: amount,
      operation,
    })

    const id = toast(
      createElement(TradeSuccessCard, {
        amount,
        symbol: tokenInfo?.ticker,
        diamond: data?.reward_amount.toString(),
        onClose: () => toast.dismiss(id),
      }),
      { position: 'bottom-left', className: 'w-100' }
    )
    setToastId(id)

    return id
  }

  const dismissDiamond = () => toast.dismiss(toastId)

  return {
    toastDiamond,
    dismissDiamond,
  }
}
