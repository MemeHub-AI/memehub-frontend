import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { utilLang } from '@/utils/lang'

const fee = '10 USDT'

const hours = '48h'
const likeCount = 50
const likeFee = '5 USDT'

const totalPercent = '1%'
const rewardPercent = '0.1%'

export const CreatePostIntro = () => {
  const { t } = useTranslation()

  return (
    <Card
      shadow="none"
      padding="sm"
      className="bg-indigo-200 space-y-1 text-sm font-semibold"
    >
      <h3 className="font-bold text-base">{t('memex.intro-title')}</h3>
      <p>{utilLang.replace(t('memex.intro-desc1'), [fee])}</p>
      <p>
        {utilLang.replace(t('memex.intro-desc2'), [hours, likeCount, likeFee])}
      </p>
      <p>
        {utilLang.replace(t('memex.intro-desc3'), [
          totalPercent,
          rewardPercent,
        ])}
      </p>
    </Card>
  )
}

export default CreatePostIntro
