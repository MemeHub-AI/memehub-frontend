import React from 'react'
import { useTranslation } from 'react-i18next'

import { FollowCard, FollowCardSkeleton } from './follow-card'
import { FollowType } from './follow-tab'
import { useAccountContext } from '@/contexts/account'
import { CustomSuspense } from '@/components/custom-suspense'

export const FollowingCards = () => {
  const { t } = useTranslation()
  const { userInfo, isPending } = useAccountContext()
  const { following = [] } = userInfo ?? {}

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={isPending}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-following')}</p>}
    >
      {following.map((f, i) => (
        <FollowCard type={FollowType.Following} card={f} key={i} />
      ))}
    </CustomSuspense>
  )
}

export default FollowingCards
