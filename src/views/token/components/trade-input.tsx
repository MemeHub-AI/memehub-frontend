import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'
import { useTokenContext } from '@/contexts/token'

interface Props extends ComponentProps<'input'> {}

export const TradeInput = (props: Props) => {
  const { value, onChange } = props
  const { t } = useTranslation()
  const { isBuy, symbol, ethBalance, tokenBalance } = useTradeContext()
  const { tokenInfo } = useTokenContext()

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
          onChange={onChange}
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
      <div className="text-zinc-500 text-xs flex justify-end mt-1 mr-1">
        {t('balance')}:{' '}
        {isBuy
          ? Number(ethBalance).toFixed(3)
          : Number(tokenBalance).toFixed(3)}
      </div>
    </>
  )
}

export default TradeInput
