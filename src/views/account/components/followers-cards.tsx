import React from 'react'
import { useTranslation } from 'react-i18next'

import { FollowCard, FollowCardSkeleton } from './follow-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { UserListRes, UserListType } from '@/api/user/types'

interface Props {
  cards: UserListRes[UserListType.Followers][]
  total: number
  isLoading: boolean
  isPending?: boolean
}

export const FollowersCards = (props: Props) => {
  const { cards, total, isLoading, isPending } = props
  const { t } = useTranslation()

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={isLoading}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-followers')}</p>}
    >
      {cards.map((f, i) => (
        <FollowCard card={f} key={i} />
      ))}
    </CustomSuspense>
  )
}

export default FollowersCards
