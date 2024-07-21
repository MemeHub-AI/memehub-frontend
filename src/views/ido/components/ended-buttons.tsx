import React from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useIdoContext } from '@/contexts/ido'
import { useIdo } from '../hooks/use-ido'

export const EndedButtons = () => {
  const { t } = useTranslation()
  const { userAmount, reserveSymbol, isCanceled } = useIdoContext()
  const { isLoading, claim, refund } = useIdo()

  if (BigNumber(userAmount).isZero()) return

  return (
    <>
      <div className="flex items-center space-x-2 mt-3">
        {!isCanceled && (
          <Button
            className="bg-yellow-200"
            shadow="none"
            disabled={isLoading}
            onClick={() => claim()}
          >
            {t('ido.claim')} 1.2 LP
          </Button>
        )}
        <Button shadow="none" disabled={isLoading} onClick={() => refund()}>
          {t('ido.refund')} {userAmount} {reserveSymbol}
        </Button>
      </div>
    </>
  )
}

export default EndedButtons
