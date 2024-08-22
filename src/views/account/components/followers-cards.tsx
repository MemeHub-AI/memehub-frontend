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
  onCardClick?: () => void
}

export const FollowersCards = ({
  cards,
  total,
  isLoading,
  isPending,
  onCardClick,
}: Props) => {
  const { t } = useTranslation()

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={isLoading}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-followers')}</p>}
    >
      {cards.map((f, i) => (
        <FollowCard card={f} key={i} onClick={onCardClick} />
      ))}
    </CustomSuspense>
  )
}

export default FollowersCards
