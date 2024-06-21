import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export const RewardRules = ({ className }: ComponentProps<'h2'>) => {
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
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.rule')}
      </h2>
      <div className="flex flex-col gap-3">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center gap-4 2xl:w-5/6">
            <img src={r.src} alt="img" className="w-12 h-12 rounded" />
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default RewardRules
