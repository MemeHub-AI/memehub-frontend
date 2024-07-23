import React from 'react'
import { useTranslation } from 'react-i18next'

import { fmt } from '@/utils/fmt'
import { useIdoContext } from '@/contexts/ido'
import { utilLang } from '@/utils/lang'

export const ParticipatedTips = () => {
  const { t } = useTranslation()
  const { isExpired, userAmount, reserveSymbol, userWeight, userQuota } =
    useIdoContext()

  return (
    <div className="mt-3 text-purple-500 font-bold">
      {isExpired ? (
        <>
          <p>
            {utilLang.replace(t('ido.get-quota'), [
              `${fmt.decimals(userAmount)} ${reserveSymbol}`,
            ])}
          </p>
          <p>
            = <span className="text-2xl">{userQuota}%</span> {t('ido.quota')}
          </p>
        </>
      ) : (
        <>
          <p>
            {t('ido.participated')} {fmt.decimals(userAmount)} {reserveSymbol} x{' '}
            {userWeight}%
          </p>
          <p>
            <span>{t('ido.obtained')}</span>
            <span className="text-xl mx-1">{fmt.decimals(userQuota)}%</span>
            <span>{t('ido.quota')}</span>
          </p>
        </>
      )}
    </div>
  )
}

export default ParticipatedTips
