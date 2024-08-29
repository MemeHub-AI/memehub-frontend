import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { inviteRewardPercet } from '@/config/reward'
import { PrimaryLayout } from '@/components/layouts/primary'
import { InviteRow } from './components/invite-row'
import { RewardCards } from './components/reward-cards'
import { RewardTable } from './components/reward-table'
import { RewardRules } from './components/reward-rules'

export const RewardPage = () => {
  const { t } = useTranslation()

  return (
    <div className="mb-4">
      <h2 className="font-bold text-2xl mb-2">{t('reward.title')}</h2>
      {/* Descriptions */}
      <div className="">
        <p>{t('reward.desc1')}</p>
        <p className="leading-9">
          {t('reward.invite-desc').split('$')[0]}
          <span className="text-blue-600 font-bold text-xl">
            {inviteRewardPercet}%
          </span>
          {t('reward.invite-desc').split('$')[1]}
        </p>
      </div>

      <InviteRow />
      <RewardCards className="mt-8" />
      <RewardTable className="mt-8" />
      <RewardRules className="mt-8" />
    </div>
  )
}

RewardPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout>{page}</PrimaryLayout>
)

export default RewardPage
