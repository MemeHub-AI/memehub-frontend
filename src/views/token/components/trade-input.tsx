import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'

import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'
import { useTokenContext } from '@/contexts/token'
import { useTradeInfo } from '../hooks/use-trade-info'

interface Props extends ComponentProps<'input'> {}

export const TradeInput = (props: Props) => {
  const { value, onChange } = props
  const { t } = useTranslation()
  const [quoteTokenAmount, setQuoteTokenAmount] = useState(0)
  const { symbol, isBuy, isSell, ethBalance, tokenBalance } = useTradeContext()
  const { tokenInfo } = useTokenContext()
  const { getBuyTokenAmount, getSellTokenAmount } = useTradeInfo()

  const baseTokenAmount = BigNumber(String(value || 0)).toFixed(6)
  const tokenAddr = tokenInfo?.address as Address
  const balance = BigNumber(isBuy ? ethBalance : tokenBalance).toFixed(2)

  const calcBuyTokenAmount = () => {
    getBuyTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = BigNumber(formatEther(weiAmount)).toFixed(2)
      setQuoteTokenAmount(Number(amount))
    })
  }

  const calcSellTokenAmount = () => {
    getSellTokenAmount(tokenAddr, value as string).then((weiAmount) => {
      const amount = BigNumber(formatEther(weiAmount)).toFixed(5)
      setQuoteTokenAmount(Number(amount))
    })
  }

  useEffect(() => {
    if (!tokenAddr) return
    if (isBuy) return calcBuyTokenAmount()
    if (isSell) return calcSellTokenAmount()
  }, [value, isBuy, isSell])

  return (
    <>
      <div className="flex items-center border rounded-md focus-within:border-black pr-2">
        <Input
          placeholder="0"
          border="none"
          disableFocusBorder
          className="flex-1"
          type="number"
          value={value}
          onChange={(e) => {
            // Cannot enter less than zero.
            if (BigNumber(e.target.value).lt(0)) return
            onChange?.(e)
          }}
        />
        <div className="flex items-center">
          <span className="mr-2 text-zinc-600">
            {isBuy ? symbol : tokenInfo?.ticker}
          </span>
          <img
            loading="lazy"
            width={20}
            height={20}
            className="object-contain"
            src={isBuy ? '/images/scroll.svg' : tokenInfo?.image}
          />
        </div>
      </div>

      <div className="text-zinc-500 text-xs flex justify-between mt-1 mr-1">
        <span>
          {isBuy
            ? `${baseTokenAmount} ${symbol} ≈ ${quoteTokenAmount} ${tokenInfo?.ticker}`
            : `${baseTokenAmount} ${tokenInfo?.ticker} ≈ ${quoteTokenAmount} ${symbol}`}
        </span>
        <span>
          {t('balance')}: {balance}
        </span>
      </div>
    </>
  )
}

export default TradeInput
