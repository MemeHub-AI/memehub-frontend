import React from 'react'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { DiamondIcon } from '@/components/diamond-icon'
import { RewardRules } from './reward-rules'

export const RewardPointsPage = () => {
  const { t } = useTranslation()

  const diamond = 1134

  return (
    <>
      <h2 className="font-bold text-xl">{t('reward.diamond')}</h2>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <DiamondIcon />
          <p className="text-2xl font-bold text-blue-600">
            {BigNumber(diamond).toFormat()}
          </p>
        </div>
        <p className="text-zinc-400">{t('reward.my-diamond')}</p>
      </div>

      <div>
        <p>{t('reward.desc1')}</p>
        <p>{t('reward.desc2')}</p>
      </div>

      <img
        src="/images/reward/bg.jpg"
        alt="poster"
        className="rounded max-h-96"
      />

      <RewardRules />
    </>
  )
}

export default RewardPointsPage
