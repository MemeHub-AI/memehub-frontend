import React from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useIdoContext } from '@/contexts/ido'
import { useIdo } from '../hooks/use-ido'
import { fmt } from '@/utils/fmt'
import { useIdoClaimed } from '../hooks/use-ido-claimed'

export const EndedButtons = ({
  onlyRefund,
}: Partial<{ onlyRefund: boolean }>) => {
  const { t } = useTranslation()
  const {
    userAmount,
    reserveSymbol,
    isCanceled,
    chainId,
    poolId,
    refetchIdoInfo,
  } = useIdoContext()
  const { isLoading, claim, refund } = useIdo(refetchIdoInfo)
  const { tokenAmount, reserveAmount, isClaimedToken, isClaimedReserve } =
    useIdoClaimed(chainId, poolId)
  const disableClaim =
    isLoading || isClaimedToken || BigNumber(tokenAmount).lte(0)
  const disableRefund =
    isLoading || isClaimedReserve || BigNumber(reserveAmount).lte(0)

  if (BigNumber(userAmount).isZero()) return

  return (
    <>
      <div className="flex items-center space-x-2 mt-3">
        {!isCanceled && !onlyRefund && (
          <Button
            variant="yellow"
            shadow="none"
            disabled={disableClaim}
            onClick={() => claim()}
          >
            {isClaimedToken
              ? t('already-claimed')
              : `${t('ido.claim')} ${BigNumber(
                  BigNumber(tokenAmount).toFixed(2)
                ).toFormat()} LP`}
          </Button>
        )}
        <Button shadow="none" disabled={disableRefund} onClick={() => refund()}>
          {isClaimedReserve
            ? t('already-refunded')
            : `${t('ido.refund')} ${fmt.decimals(
                reserveAmount
              )} ${reserveSymbol}`}
        </Button>
      </div>
    </>
  )
}

export default EndedButtons
