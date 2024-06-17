import React from 'react'
import { useTranslation } from 'react-i18next'

export const RewardRules = () => {
  const { t } = useTranslation()

  const rules = [
    {
      src: '/images/reward/startcoin.png',
      text: t('reward.rule1'),
    },
    {
      src: '/images/reward/deal.png',
      text: t('reward.rule2'),
    },
    {
      src: '/images/reward/startup.png',
      text: t('reward.rule3'),
    },
  ]

  return (
    <>
      <h3 className="font-bold text-lg mt-8 mb-3">{t('reward.rule')}</h3>
      {rules.map((r, i) => (
        <div key={i} className="flex items-center gap-4 2xl:w-5/6">
          <img src={r.src} alt="img" className="max-w-16 max-h-16 rounded" />
          <p>{r.text}</p>
        </div>
      ))}
    </>
  )
}

export default RewardRules
