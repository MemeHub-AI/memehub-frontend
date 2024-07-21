import React from 'react'
import { useTranslation } from 'react-i18next'
import { InfoIcon } from 'lucide-react'
import dayjs from 'dayjs'

import { useIdoContext } from '@/contexts/ido'
import { dateTiemFormat } from '@/config/dayjs'

export const IdoNotStart = () => {
  const { t } = useTranslation()
  const { startAt, totalReserveAmount } = useIdoContext()

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center space-x-1 mt-3">
        <span className="font-bold mr-1">{t('ido.total-amount')}:</span>
        {totalReserveAmount} BNB
        <InfoIcon className="w-4" />
      </div>
      <div>
        <span className="font-bold mr-1"> {t('ido.start-in')}:</span>
        {dayjs(startAt * 1000).format(dateTiemFormat)}
      </div>
      <div>
        <span className="font-bold mr-1">{t('ido.eligibility')}: </span>
        {t('ido.holder-nft')}
      </div>
    </div>
  )
}

export default IdoNotStart
