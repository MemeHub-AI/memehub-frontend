import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { useDebounceEffect } from 'ahooks'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { useTradeTabsContext } from '@/contexts/trade-tabs'
import { useTokenContext } from '@/contexts/token'
import { cn } from '@/lib/utils'
import { fmt } from '@/utils/fmt'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomSuspense } from '@/components/custom-suspense'
import { Img } from '@/components/img'
import { utilLang } from '@/utils/lang'
import { useTradeAmount } from '../../hooks/use-trade-amount'

interface Props {
  value: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export const TradeInput = ({ value, onChange, disabled }: Props) => {
  const { t } = useTranslation()
  const {
    tokenInfo,
    reserveSymbol,
    isLoadingTokenInfo,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    tokenChain,
    totalSupply,
    tradePrice,
  } = useTokenContext()
  const { isBuy, isTraded, reserveBalance, tokenBalance } =
    useTradeTabsContext()
  const [rightValue, setRightValue] = useState('0')
  const { getTokenAmount, getReserveAmount, getLastAmount } = useTradeAmount()

  const tokenSymbol = tokenInfo?.symbol || tokenMetadata?.symbol

  const balance = isBuy ? reserveBalance : tokenBalance
  const balanceSymbol = isBuy ? reserveSymbol : tokenSymbol
  const balanceLabel = `${fmt.decimals(balance)} ${balanceSymbol}`

  const usdtPrice = BigNumber(isBuy ? value : rightValue).multipliedBy(
    tradePrice?.price || 0
  )
  const usdtLabel = `($${
    usdtPrice.isNaN() || usdtPrice.lte(0) ? 0 : fmt.decimals(usdtPrice)
  })`
  const leftValue = fmt.decimals(value || 0, { fixed: 4 })
  const leftLabel = `${leftValue} ${isBuy ? reserveSymbol : tokenSymbol}`
  const rightLabel = `${fmt.decimals(rightValue, { fixed: 4 })} ${
    isBuy ? tokenSymbol : reserveSymbol
  }`

  const checkLastOrder = async () => {
    if (isGraduated) return true
    const [, amountLeft] = await getLastAmount()

    if (BigNumber(value).gt(amountLeft)) {
      toast.warning(
        utilLang.replace(t('trade.limit'), [
          `${amountLeft} ${reserveSymbol}`,
          t('trade.buy'),
        ])
      )
      onChange?.(amountLeft)
      return false
    }
    return true
  }

  const calcInputAmount = async () => {
    let amount = '0'

    if (!tokenAddr || !value) return setRightValue('0')
    if (BigNumber(value).lte(0)) return
    if (isBuy) {
      if (!(await checkLastOrder())) return
      const [, tokenAmount] = await getTokenAmount(value)
      amount = tokenAmount
    } else {
      const [, reserveAmount] = await getReserveAmount(value)
      amount = reserveAmount
    }

    setRightValue(amount)
  }

  useDebounceEffect(
    () => {
      calcInputAmount()
    },
    [value, isBuy, isTraded],
    { wait: 500 }
  )

  return (
    <>
      <Input
        placeholder="0"
        className="flex-1"
        inputClass="pr-1"
        type="number"
        value={value}
        onChange={({ target }) => {
          if (BigNumber(target.value).gt(totalSupply)) return
          if (BigNumber(target.value).lt(0)) return
          onChange?.(target.value)
        }}
        disabled={disabled}
        endIcon={
          isLoadingTokenInfo ? (
            <div className="flex items-center mr-2">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-6 h-6 ml-1" />
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center shrink-0 pr-2',
                disabled && 'opacity-50'
              )}
            >
              <span className="mr-2 text-zinc-600">
                {isBuy ? reserveSymbol : fmt.ellipsis(tokenSymbol)}
              </span>
              <Img
                src={isBuy ? tokenChain?.logo : tokenInfo?.image_url}
                width={20}
                height={20}
                className="object-contain rounded"
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
        className="text-zinc-500 text-xs flex flex-col space-y-1 mt-1"
      >
        <span>
          {leftLabel} {isBuy && usdtLabel} ≈ {rightLabel} {!isBuy && usdtLabel}
        </span>
        <span className="mt-1">
          {t('balance')}: {balanceLabel}
        </span>
      </CustomSuspense>
    </>
  )
}

export default TradeInput
