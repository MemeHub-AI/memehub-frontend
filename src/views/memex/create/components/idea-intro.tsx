import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { utilLang } from '@/utils/lang'
import { memexIntroConfig } from '@/config/memex/idea'

const {
  createFee,
  durationHours,
  totalLike,
  likeFee,
  creatorReward,
  likerReward,
} = memexIntroConfig

export const CreateIdeaIntro = () => {
  const { t } = useTranslation()

  return (
    <Card
      hover="none"
      shadow="none"
      padding="sm"
      className="bg-indigo-200 space-y-1 text-sm"
    >
      <h3 className="font-bold text-base">{t('memex.intro-title')}</h3>
      <p>{utilLang.replace(t('memex.intro-desc1'), [createFee])}</p>
      <p>
        {utilLang.replace(t('memex.intro-desc2'), [
          durationHours,
          totalLike,
          likeFee,
        ])}
      </p>
      <p>
        {utilLang.replace(t('memex.intro-desc3'), [creatorReward, likerReward])}
      </p>
    </Card>
  )
}

export default CreateIdeaIntro
