import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { utilLang } from '@/utils/lang'
import { rewardRules } from '@/config/reward'

const {
  createToken,
  tradeThreshold,
  tradeBuy,
  tradeSell,
  graduated,
  createIdea,
  likeIdea,
  likeGraduated,
} = rewardRules

export const RewardRules = ({ className }: ComponentProps<'h2'>) => {
  const { t } = useTranslation()

  const rules = [
    {
      src: '/images/reward/startcoin.png',
      text: utilLang.replace(t('reward.rule1'), [createToken]),
    },
    {
      src: '/images/reward/deal.png',
      text: utilLang.replace(t('reward.rule2'), [
        tradeThreshold,
        tradeBuy,
        tradeThreshold,
        tradeSell,
      ]),
    },
    {
      src: '/images/reward/startup.png',
      text: utilLang.replace(t('reward.rule3'), [graduated]),
    },
    {
      icon: '💡',
      text: utilLang.replace(t('reward.rule4'), [
        createIdea,
        likeIdea,
        likeGraduated,
      ]),
      className: 'invert',
    },
  ]

  return (
    <>
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.rule')}
      </h2>
      <div className="flex flex-col space-y-3">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center space-x-4 2xl:w-5/6">
            {r.src && (
              <img
                src={r.src}
                alt="img"
                className={cn('w-12 h-12 rounded', r.className)}
              />
            )}
            {r.icon && <span className="text-5xl">{r.icon}</span>}
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default RewardRules
