import React from 'react'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'
import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'

export const BondingCurveProgress = () => {
  const { t } = useTranslation()
  const { totalToken, tokenProgress, tokenInfo } = useTokenContext()
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''
  const threshold = BigNumber(totalToken).lte(0)
    ? t('threshold')
    : ` ${fmt.decimals(totalToken, 3)} ${nativeSymbol} `

  return (
    <div className="my-3 flex-1">
      <Progress
        className="h-5"
        indicatorClass="bg-blue-600"
        labelClass="text-white"
        value={Number(tokenProgress)}
      />
      <div className="text-zinc-400 text-xs mt-2">
        {t('bonding-curve.token').replace('{}', threshold)}
      </div>
    </div>
  )
}

export default BondingCurveProgress
