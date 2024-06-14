import React from 'react'
import { useTranslation } from 'react-i18next'

import { PrimaryLayout } from '@/components/layouts/primary'

export const RewardPage = () => {
  const { t } = useTranslation()

  const rules = [
    {
      src: '/images/cat.jpg',
      text: t('reward.rule1'),
    },
    {
      src: '/images/cat.jpg',
      text: t('reward.rule2'),
    },
    {
      src: '/images/cat.jpg',
      text: t('reward.rule3'),
    },
  ]

  return (
    <PrimaryLayout container="div" className="mt-4 space-y-2">
      <h2 className="font-bold text-xl">{t('reward.diamond')}</h2>
      <div className="flex items-center gap-2">
        <p className="text-xl text-blue-600">1134</p>
        <p className="text-zinc-400">{t('reward.my-diamond')}</p>
      </div>

      <div>
        <p>{t('reward.desc1')}</p>
        <p>{t('reward.desc2')}</p>
      </div>

      <img src="/images/cat.jpg" alt="poster" className="rounded h-96" />

      <h3 className="font-bold text-lg !mt-4">{t('reward.rule')}</h3>
      {rules.map((r, i) => (
        <div key={i} className="flex items-center gap-2 2xl:w-4/6">
          <img src={r.src} alt="img" className="w-16 h-16 rounded" />
          <p>{r.text}</p>
        </div>
      ))}
    </PrimaryLayout>
  )
}

export default RewardPage
