import React from 'react'
import { useTranslation } from 'react-i18next'

import { RewardRules } from './reward-rules'

export const RewardFullPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2 className="font-bold text-xl">{t('reward.diamond')}</h2>

      <div>
        <p>{t('reward.desc1')}</p>
        <p>{t('reward.desc2')}</p>
      </div>

      <RewardRules />
    </>
  )
}

export default RewardFullPage
