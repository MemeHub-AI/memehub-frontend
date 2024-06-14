import React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'

import { utilLang } from '@/utils/lang'

interface Props {
  amount: string
  symbol: string
  diamond: string
}

export const TradeSuccessCard = ({ amount, symbol, diamond }: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <X
        className="absolute right-2 top-2 cursor-pointer"
        size={20}
        onClick={() => toast.dismiss()}
      />
      <div>
        <h2 className="font-bold text-lg">{t('trade.success')}</h2>
        <p className="text-base my-1">
          {utilLang.replace(t('trade.success.reward'), [
            BigNumber(amount).toFormat(),
            symbol,
          ])}
        </p>
        <p className="text-base">
          {t('trade.success.diamond').split('$')[0]}
          <span className="text-xl text-blue-600">{diamond}</span>
          {t('trade.success.diamond').split('$')[1]}
        </p>
      </div>
    </>
  )
}

export default TradeSuccessCard
