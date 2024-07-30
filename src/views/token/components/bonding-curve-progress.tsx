import React, { ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'
import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { useTokenProgressV3 } from '../hooks/trade-v3/use-token-progress'
import { Badge } from '@/components/ui/badge'
import { useIdoProgress } from '@/views/ido/hooks/use-ido-progress'
import { idoTrumpCard } from '@/config/ido'

interface Props extends ComponentProps<'div'> {
  showDesc?: boolean
}

export const BondingCurveProgress = ({ showDesc = true, className }: Props) => {
  const { t } = useTranslation()
  const { tokenInfo, isIdoToken } = useTokenContext()
  const { total, progress, isGrauated } = useTokenProgressV3()

  const { progress: idoProgress } = useIdoProgress(
    Number(idoTrumpCard.chain.id),
    idoTrumpCard.id
  )

  const nativeSymbol = tokenInfo?.chain.native.symbol || ''
  const threshold = BigNumber(total).lte(0)
    ? t('threshold')
    : ` ${fmt.decimals(total, { fixed: 3 })} ${nativeSymbol} `

  return (
    <div className={cn('flex-1 relative', className)}>
      <Progress
        className={cn(
          'h-6 border-2 border-black rounded-md',
          isIdoToken && 'text-white'
        )}
        indicatorClass={isIdoToken ? 'bg-red-500' : 'bg-lime-green'}
        value={isIdoToken ? idoProgress : isGrauated ? 100 : progress}
      />
      {isGrauated && (
        <Badge
          variant="success"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 whitespace-nowrap"
        >
          {t('token.already-listed')}
        </Badge>
      )}
      {showDesc && (
        <div className="text-zinc-400 text-xs mt-2">
          {t('bonding-curve.token').replace('{}', threshold)}
        </div>
      )}
    </div>
  )
}

export default BondingCurveProgress
