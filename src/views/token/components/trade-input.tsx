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
import { useTradeInfoV3 } from '../hooks/trade-v3/use-trade-info'
import { utilLang } from '@/utils/lang'
import { Img } from '@/components/img'
import { useChainInfo } from '@/hooks/use-chain-info'
import { usePools } from '../hooks/use-pools'
import { useUniswapV2Info } from '../hooks/trade-dex/use-uniswapv2-info'

interface Props extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: (value: string) => void
}

export const TradeInput = ({ value, disabled, onChange }: Props) => {
  const { t } = useTranslation()
  const { isBuy, isSell, isTraded, nativeSymbol, nativeBalance, tokenBalance } =
    useTradeContext()
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const {
    getMaxSupply: getTotalSupply,
    getTokenAmount,
    getNativeAmount,
  } = useTradeInfoV3()
  const { chainInfo } = useChainInfo()
  const { isGrauated } = usePools(tokenInfo?.address)
  const { getAmountOut } = useUniswapV2Info(tokenInfo?.pool_address as Address)

  const inputAmount = fmt.decimals(String(value || 0), { fixed: 3 })
  const [targetAmount, setTargetAmount] = useState('0')
  const tokenSymbol = tokenInfo?.ticker || ''
  const tokenAddr = tokenInfo?.address as Address
  const balance = fmt.decimals(isBuy ? nativeBalance : tokenBalance)

  const onValueChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (BigNumber(target.value).lt(0)) return
    // if (BigNumber(balance).lte(0)) return
    // if (BigNumber(target.value).gt(balance)) {
    //   return onChange?.(balance)
    // }

    onChange?.(target.value)
  }

  // Calculate buy pair amount.
  const calcAmountForBuy = async () => {
    const total = formatEther(await getTotalSupply())
    if (BigNumber(value as string).gt(total)) {
      value = total
      onChange?.(value)
      toast.warning(utilLang.replace(t('trade.limit'), [value, t('trade.buy')]))
    }

    const tokenAmount = await (isGrauated
      ? getAmountOut(value as string)
      : getTokenAmount(value as string))
    const amount = fmt.decimals(BigNumber(formatEther(tokenAmount)))
    setTargetAmount(amount)
  }

  // Calculate sell pair amount.
  const calcAmountForSell = async () => {
    const current = formatEther(await getTotalSupply())
    if (BigNumber(value as string).gt(current)) {
      value = current
      onChange?.(value)
      toast.warning(
        utilLang.replace(t('trade.limit'), [value, t('trade.sell')])
      )
    }

    const nativeAmount = await (isGrauated
      ? getAmountOut(value as string, true)
      : getNativeAmount(value as string))
    const amount = fmt.decimals(BigNumber(formatEther(nativeAmount)))
    setTargetAmount(amount)
  }

  const calcAmount = () => {
    if (!tokenAddr || !value) {
      setTargetAmount('0')
      return
    }
    if (BigNumber(value.toString()).lte(0)) return
    if (isBuy) return calcAmountForBuy()
    if (isSell) return calcAmountForSell()
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
                {isBuy ? nativeSymbol : tokenSymbol}
              </span>
              <Img
                src={isBuy ? chainInfo?.logo : tokenInfo?.image}
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
          {inputAmount} {isBuy ? nativeSymbol : tokenSymbol} ≈ {targetAmount}{' '}
          {isBuy ? tokenSymbol : nativeSymbol}
        </span>
        <span className="mt-1">
          {t('balance')}: {balance} {isBuy ? nativeSymbol : tokenSymbol}
        </span>
      </CustomSuspense>
    </>
  )
}

export default TradeInput
