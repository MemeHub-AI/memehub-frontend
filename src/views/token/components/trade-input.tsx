import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useDebounce } from 'react-use'

import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'
import { useTokenContext } from '@/contexts/token'
import { useTradeInfoV1 } from '../hooks/v1/use-trade-info'
import { cn } from '@/lib/utils'
import { fmt } from '@/utils/fmt'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomSuspense } from '@/components/custom-suspense'

interface Props extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: (value: string) => void
}

export const TradeInput = ({ value, disabled, onChange }: Props) => {
  const { t } = useTranslation()
  const [quoteTokenAmount, setQuoteTokenAmount] = useState('0')
  const { isBuy, isSell, isTraded, nativeSymbol, nativeBalance, tokenBalance } =
    useTradeContext()
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const { getBuyTokenAmount, getSellTokenAmount } = useTradeInfoV1()

  const tokenSymbol = tokenInfo?.ticker || ''
  const baseTokenAmount = fmt.decimals(String(value || 0))
  const tokenAddr = tokenInfo?.address as Address
  const balance = fmt.decimals(isBuy ? nativeBalance : tokenBalance)

  const calcBuyTokenAmount = () => {
    getBuyTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = fmt.decimals(BigNumber(formatEther(weiAmount)))
      setQuoteTokenAmount(amount)
    })
  }

  const calcSellTokenAmount = () => {
    getSellTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = fmt.decimals(BigNumber(formatEther(weiAmount)))
      setQuoteTokenAmount(amount)
    })
  }

  const calcAmount = () => {
    if (!tokenAddr) return
    if (isBuy) return calcBuyTokenAmount()
    if (isSell) return calcSellTokenAmount()
  }

  const onValueChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (BigNumber(target.value).lt(0)) return
    if (BigNumber(balance).lte(0)) return
    if (BigNumber(target.value).gt(balance)) {
      return onChange?.(balance)
    }

    onChange?.(target.value)
  }

  useDebounce(calcAmount, 500, [value, isBuy, isSell, isTraded])

  return (
    <>
      <Input
        placeholder="0"
        className="flex-1"
        inputClass="pr-1"
        type="number"
        value={value}
        onChange={onValueChange}
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
      <CustomSuspense
        isPending={isLoadingTokenInfo}
        fallback={
          <>
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-24 h-4" />
          </>
        }
        className="text-zinc-500 text-xs flex flex-col pt-1 gap-1"
      >
        <span>
          {isBuy
            ? `${baseTokenAmount} ${nativeSymbol} ≈ ${quoteTokenAmount} ${tokenSymbol}`
            : `${baseTokenAmount} ${tokenSymbol} ≈ ${quoteTokenAmount} ${nativeSymbol}`}
        </span>
        <span>
          {t('balance')}: {balance} {isBuy ? nativeSymbol : tokenSymbol}
        </span>
      </CustomSuspense>
    </>
  )
}

export default TradeInput
