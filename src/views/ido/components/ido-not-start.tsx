import React from 'react'
import { useTranslation } from 'react-i18next'
import { InfoIcon } from 'lucide-react'
import dayjs from 'dayjs'

import { useIdoContext } from '@/contexts/ido'
import { Countdown } from '@/components/countdown'

interface Props {
  onExpired?: (value: boolean) => void
}

export const IdoNotStart = ({ onExpired }: Props) => {
  const { t } = useTranslation()
  const { startAt, totalReserveAmount, reserveSymbol } = useIdoContext()

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center space-x-1 mt-3">
        <span className="font-bold mr-1">{t('ido.total-amount')}:</span>
        {totalReserveAmount} {reserveSymbol}
        <InfoIcon className="w-4" />
      </div>
      <div className="flex items-center space-x-1">
        <span className="font-bold mr-1"> {t('ido.start-in')}:</span>
        <Countdown
          createdAt={startAt}
          duration={startAt - dayjs().unix()}
          onExpired={onExpired}
        />
      </div>
      <div>
        <span className="font-bold mr-1">{t('ido.eligibility')}: </span>
        {t('ido.holder-nft')}
      </div>
    </div>
  )
}

export default IdoNotStart
