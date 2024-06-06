import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { useTradeContext } from '@/contexts/trade'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useTokenContext } from '@/contexts/token'
import { Skeleton } from '@/components/ui/skeleton'

const buyItems = ['0.001', '0.01', '1']

const sellItems = ['10', '25', '75', '100']

interface Props extends ComponentProps<'button'> {
  onBuyItemClick?: (value: string) => void
  onSellItemClick?: (value: string) => void
  onResetClick?: (value: '') => void
}

export const TradeItems = (props: Props) => {
  const { disabled, onBuyItemClick, onSellItemClick, onResetClick } = props
  const { t } = useTranslation()
  const { isLoadingTokenInfo } = useTokenContext()
  const { isBuy, nativeSymbol } = useTradeContext()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  if (isLoadingTokenInfo) {
    return (
      <div className="flex gap-2 mt-3">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-16 h-6" />
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="xs"
        shadow="none"
        variant="outline"
        onClick={() => onResetClick?.('')}
        disabled={disabled}
      >
        {t('reset')}
      </Button>
      {(isBuy ? buyItems : sellItems).map((value, i) => (
        <Button
          size="xs"
          shadow="none"
          key={i}
          onClick={() => {
            if (!isConnected) {
              setConnectOpen(true)
              return
            }
            isBuy ? onBuyItemClick?.(value) : onSellItemClick?.(value)
          }}
          disabled={disabled}
        >
          {value} {isBuy ? nativeSymbol : '%'}
        </Button>
      ))}
    </div>
  )
}

export default TradeItems
