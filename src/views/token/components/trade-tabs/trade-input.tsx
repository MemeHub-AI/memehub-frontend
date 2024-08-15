import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'
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
import { useUniswapV2Amount } from '@/hooks/uniswapv2/use-uniswapv2-info'
import { useTradeAmount } from '../../hooks/evm/use-trade-amount'
import { utilLang } from '@/utils/lang'

interface Props extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: (value: string) => void
}

export const TradeInput = ({ value, disabled, onChange }: Props) => {
  const { t } = useTranslation()
  const {
    tokenInfo,
    reserveSymbol,
    isLoadingTokenInfo,
    isIdoToken,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    tokenLeft,
    chainId,
    tokenChain,
  } = useTokenContext()
  const { isBuy, isTraded, nativeBalance, tokenBalance } = useTradeTabsContext()
  const { getTokenAmount, getReserveAmount, getLastOrderAmount } =
    useTradeAmount()
  const tokenSymbol = tokenInfo?.symbol || tokenMetadata?.symbol

  const { getAmountForBuy, getAmountForSell } = useUniswapV2Amount(
    chainId,
    tokenInfo?.graduated_pool
  )
  const [targetAmount, setTargetAmount] = useState('0')

  const onValueChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (BigNumber(target.value).lt(0)) return
    onChange?.(target.value)
  }

  const checkForLastOrder = async () => {
    if (isGraduated || isIdoToken) return

    const leftAmount = formatEther(await getLastOrderAmount(tokenLeft))
    if (BigNumber(value as string).gt(leftAmount)) {
      toast.warning(
        utilLang.replace(t('trade.limit'), [
          `${leftAmount} ${reserveSymbol}`,
          t('trade.buy'),
        ])
      )
      onChange?.(leftAmount)
      return false
    }
    return true
  }

  const calcAmountForBuy = async () => {
    value = value as string

    if (!checkForLastOrder()) return

    const tokenAmount = formatEther(
      await (isGraduated || isIdoToken
        ? getAmountForBuy(value)
        : getTokenAmount(value))
    )
    const amount = fmt.decimals(BigNumber(tokenAmount))

    setTargetAmount(amount)
  }

  const calcAmountForSell = async () => {
    value = value as string
    const nativeAmount = formatEther(
      await (isGraduated || isIdoToken
        ? getAmountForSell(value)
        : getReserveAmount(value))
    )
    const amount = fmt.decimals(BigNumber(nativeAmount))

    setTargetAmount(amount)
  }

  const calcAmount = () => {
    if (!tokenAddr || !value) return setTargetAmount('0')
    if (BigNumber(value.toString()).lte(0)) return

    if (isBuy) {
      calcAmountForBuy()
    } else {
      calcAmountForSell()
    }
  }

  useDebounceEffect(calcAmount, [value, isBuy, isTraded], { wait: 500 })

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
                {isBuy ? reserveSymbol : tokenSymbol}
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
          {fmt.decimals(String(value || 0), { fixed: 3 })}{' '}
          {isBuy ? reserveSymbol : tokenSymbol} ≈ {targetAmount}{' '}
          {isBuy ? tokenSymbol : reserveSymbol}
        </span>
        <span className="mt-1">
          {t('balance')}: {fmt.decimals(isBuy ? nativeBalance : tokenBalance)}{' '}
          {isBuy ? reserveSymbol : tokenSymbol}
        </span>
      </CustomSuspense>
    </>
  )
}

export default TradeInput
