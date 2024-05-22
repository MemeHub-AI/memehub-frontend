import React from 'react'
import { useTranslation } from 'react-i18next'

import { FollowCard, FollowCardSkeleton } from './follow-card'
import { FollowType } from './follow-tab'
import { useAccountContext } from '@/contexts/account'
import { CustomSuspense } from '@/components/custom-suspense'

export const FollowersCards = () => {
  const { t } = useTranslation()
  const { userInfo, isPending } = useAccountContext()
  const { followers = [] } = userInfo ?? {}

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={isPending}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-followers')}</p>}
    >
      {followers.map((f, i) => (
        <FollowCard type={FollowType.Followers} card={f} key={i} />
      ))}
    </CustomSuspense>
  )
}

export default FollowersCards
