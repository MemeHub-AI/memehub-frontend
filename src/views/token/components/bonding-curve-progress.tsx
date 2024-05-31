import React from 'react'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'
import { useTokenContext } from '@/contexts/token'

export const BondingCurveProgress = () => {
  const { t } = useTranslation()
  const { currentToken, totalToken, tokenInfo } = useTokenContext()
  const percent = BigNumber(currentToken)
    .div(totalToken)
    .multipliedBy(100)
    .toFixed(3)
  const marketMax = BigNumber(totalToken).toFixed(3)
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''

  return (
    <div className="my-3 flex-1">
      <Progress
        className="h-5"
        indicatorClass="bg-blue-600"
        labelClass="text-white"
        value={Number(percent)}
        label={Number.isNaN(Number(percent)) ? '0' : percent}
      />
      <div className="text-zinc-400 text-xs mt-2">
        {t('bonding-curve.token').replace('{}', `${marketMax} ${nativeSymbol}`)}
      </div>
    </div>
  )
}

export default BondingCurveProgress
