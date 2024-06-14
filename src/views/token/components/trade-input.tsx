import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useDebounce } from 'react-use'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'
import { useTokenContext } from '@/contexts/token'
import { cn } from '@/lib/utils'
import { fmt } from '@/utils/fmt'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomSuspense } from '@/components/custom-suspense'
import { useTradeInfoV2 } from '../hooks/v2/use-trade-info'
import { utilLang } from '@/utils/lang'

interface Props extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: (value: string) => void
}

export const TradeInput = ({ value, disabled, onChange }: Props) => {
  const { t } = useTranslation()
  const [nativeAmount, setNativeAmount] = useState('0')
  const { isBuy, isSell, isTraded, nativeSymbol, nativeBalance, tokenBalance } =
    useTradeContext()
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const { tokenDetails, getAmountForBuy, getAmountForSell } = useTradeInfoV2()

  const tokenSymbol = tokenInfo?.ticker || ''
  const tokenAmount = fmt.decimals(String(value || 0), 3)
  const tokenAddr = tokenInfo?.address as Address
  const balance = fmt.decimals(isBuy ? nativeBalance : tokenBalance)

  const onValueChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (BigNumber(target.value).lt(0)) return
    if (BigNumber(balance).lte(0)) return
    // if (BigNumber(target.value).gt(balance)) {
    //   return onChange?.(balance)
    // }

    onChange?.(target.value)
  }

  const calcAmountForBuy = async (value: string) => {
    // Already checked in `calcAmount`.
    const total = formatEther(tokenDetails!.info.maxSupply)

    if (BigNumber(value).gt(total)) {
      value = total
      onChange?.(value)
      toast.warning(utilLang.replace(t('trade.limit'), [value, t('trade.buy')]))
    }

    const [weiAmount] = await getAmountForBuy(tokenAddr, value)
    const amount = fmt.decimals(BigNumber(formatEther(weiAmount)))

    setNativeAmount(amount)
  }

  const calcAmountForSell = async (value: string) => {
    // Already checked in `calcAmount`
    const current = formatEther(tokenDetails!.info.currentSupply)

    if (BigNumber(value).gt(current)) {
      value = current
      onChange?.(value)
      toast.warning(
        utilLang.replace(t('trade.limit'), [value, t('trade.sell')])
      )
    }

    const [weiAmount] = await getAmountForSell(tokenAddr, value)
    const amount = fmt.decimals(BigNumber(formatEther(weiAmount)))

    setNativeAmount(amount)
  }

  const calcAmount = () => {
    if (!tokenAddr || !value || !tokenDetails) {
      setNativeAmount('0')
      return
    }
    if (isBuy) return calcAmountForBuy(value as string)
    if (isSell) return calcAmountForSell(value as string)
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
              <span className="mr-2 text-zinc-600">{tokenSymbol}</span>
              <img
                loading="lazy"
                width={20}
                height={20}
                className="object-contain rounded"
                src={tokenInfo?.image}
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
          {[tokenAmount, tokenSymbol, '≈', nativeAmount, nativeSymbol].join(
            ' '
          )}
        </span>
        <span>
          {t('balance')}: {balance} {isBuy ? nativeSymbol : tokenSymbol}
        </span>
      </CustomSuspense>
    </>
  )
}

export default TradeInput
