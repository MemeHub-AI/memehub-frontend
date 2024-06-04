import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'

import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'
import { useTokenContext } from '@/contexts/token'
import { useTradeInfo } from '../hooks/use-trade-info'
import { cn } from '@/lib/utils'
import { fmt } from '@/utils/fmt'
import { Skeleton } from '@/components/ui/skeleton'

interface Props extends ComponentProps<'input'> {}

export const TradeInput = ({ value, disabled, onChange }: Props) => {
  const { t } = useTranslation()
  const [quoteTokenAmount, setQuoteTokenAmount] = useState(0)
  const { isBuy, isSell, isTraded, nativeSymbol, ethBalance, tokenBalance } =
    useTradeContext()
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const { getBuyTokenAmount, getSellTokenAmount } = useTradeInfo()

  const tokenSymbol = tokenInfo?.ticker || ''
  const baseTokenAmount = fmt.tradeFixed(BigNumber(String(value || 0)))
  const tokenAddr = tokenInfo?.address as Address
  const balance = fmt.decimals(isBuy ? ethBalance : tokenBalance)

  const calcBuyTokenAmount = () => {
    getBuyTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = fmt.tradeFixed(BigNumber(formatEther(weiAmount)))
      setQuoteTokenAmount(Number(amount))
    })
  }

  const calcSellTokenAmount = () => {
    getSellTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = fmt.tradeFixed(BigNumber(formatEther(weiAmount)))
      setQuoteTokenAmount(Number(amount))
    })
  }

  useEffect(() => {
    if (!tokenAddr) return
    if (isBuy) return calcBuyTokenAmount()
    if (isSell) return calcSellTokenAmount()
  }, [value, isBuy, isSell, isTraded])

  return (
    <>
      <Input
        placeholder="0"
        className="flex-1"
        type="number"
        value={value}
        onChange={(e) => {
          // Cannot enter less than zero.
          if (BigNumber(e.target.value).lt(0)) return
          onChange?.(e)
        }}
        disabled={disabled}
        endIcon={
          isLoadingTokenInfo ? (
            <div className="flex items-center gap-1 mr-2">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-6 h-6" />
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center shrink-0 pr-2',
                disabled && 'opacity-50'
              )}
            >
              <span className="mr-2 text-zinc-600">
                {isBuy ? nativeSymbol : tokenSymbol}
              </span>
              <img
                loading="lazy"
                width={20}
                height={20}
                className="object-contain rounded"
                src={isBuy ? tokenInfo?.chain.logo : tokenInfo?.image}
              />
            </div>
          )
        }
      />
      <div className="text-zinc-500 text-xs flex justify-between mt-1 mr-1">
        {isLoadingTokenInfo ? (
          <Skeleton className="w-20 h-4" />
        ) : (
          <span>
            {isBuy
              ? `${baseTokenAmount} ${nativeSymbol} ≈ ${quoteTokenAmount} ${tokenSymbol}`
              : `${baseTokenAmount} ${tokenSymbol} ≈ ${quoteTokenAmount} ${nativeSymbol}`}
          </span>
        )}
        {isLoadingTokenInfo ? (
          <Skeleton className="w-20 h-4" />
        ) : (
          <span>
            {t('balance')}: {balance} {isBuy ? nativeSymbol : tokenSymbol}
          </span>
        )}
      </div>
    </>
  )
}

export default TradeInput
