import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useTradeContext } from '@/contexts/trade'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useTokenContext } from '@/contexts/token'
import { Skeleton } from '@/components/ui/skeleton'
import { tradeBuyItems, tradeDefaultItems } from '@/config/trade'
import { useChainInfo } from '@/hooks/use-chain-info'

const sellItems = ['25', '50', '75', '100']

interface Props extends ComponentProps<'button'> {
  onItemClick?: (value: string) => void
  onResetClick?: (value: '') => void
}

export const TradeItems = ({ disabled, onItemClick, onResetClick }: Props) => {
  const { t } = useTranslation()
  const { isLoadingTokenInfo, tokenInfo } = useTokenContext()
  const { isBuy, nativeBalance, nativeSymbol, tokenBalance } = useTradeContext()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()
  const { chainId } = useChainInfo()
  const buyItems =
    tradeBuyItems[chainId as keyof typeof tradeBuyItems] ?? tradeDefaultItems

  const onBuyClick = (value: string) => {
    // if (BigNumber(nativeBalance).lte(0)) {
    //   toast.warning(t('trade.balance.zero'))
    //   return
    // }
    // if (BigNumber(value).gt(nativeBalance)) {
    //   setValue(nativeBalance)
    //   return
    // }

    onItemClick?.(value)
  }

  const onSellClick = (value: string) => {
    if (BigNumber(tokenBalance).lte(0)) {
      toast.warning(t('trade.balance.zero'))
      return
    }
    const percent = BigNumber(value).multipliedBy(tokenBalance).div(100)

    onItemClick?.(percent.toFixed())
  }

  if (isLoadingTokenInfo) {
    return (
      <div className="flex mt-3">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-16 h-6 ml-2" />
        <Skeleton className="w-16 h-6 ml-2" />
        <Skeleton className="w-16 h-6 ml-2" />
      </div>
    )
  }

  return (
    <div className="flex mt-3 flex-nowrap space-x-2 overflow-x-auto">
      {(isBuy ? buyItems : sellItems).map((v, i) => (
        <Button
          size="xs"
          shadow="none"
          key={i}
          onClick={() => {
            isBuy ? onBuyClick(v) : onSellClick(v)
          }}
          disabled={disabled}
        >
          {v} {isBuy ? nativeSymbol : '%'}
        </Button>
      ))}
    </div>
  )
}

export default TradeItems
