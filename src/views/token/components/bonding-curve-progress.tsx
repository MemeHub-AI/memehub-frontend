import React, { ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'
import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { useTokenProgressV3 } from '../hooks/trade-v3/use-token-progress'
import { useBondingCurveProgressStore } from '@/stores/use-bonding-curve-progress'

interface Props extends ComponentProps<'div'> {
  showDesc?: boolean
}

export const BondingCurveProgress = ({ showDesc = true, className }: Props) => {
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const { total, progress } = useTokenProgressV3()

  const nativeSymbol = tokenInfo?.chain.native.symbol || ''
  const threshold = BigNumber(total).lte(0)
    ? t('threshold')
    : ` ${fmt.decimals(total, 3)} ${nativeSymbol} `

  return (
    <div className={cn('flex-1', className)}>
      <Progress
        className="h-6 border-2 border-black rounded-md"
        indicatorClass="bg-lime-green "
        value={progress}
      />
      {showDesc && (
        <div className="text-zinc-400 text-xs mt-2">
          {t('bonding-curve.token').replace('{}', threshold)}
        </div>
      )}
    </div>
  )
}

export default BondingCurveProgress
