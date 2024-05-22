import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserMyInfoFollow } from '@/api/user/types'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/stores/use-user-store'
import { useUser } from '@/hooks/use-user'
import { useAccountContext } from '@/contexts/account'

interface Props extends ComponentProps<'div'> {
  card: UserMyInfoFollow
}

export const FollowCard = ({ card }: Props) => {
  const { t } = useTranslation()
  const { isFollowed } = useUserStore()
  const { follow, unfollow } = useUser({
    onFollowSuccess: () => refetchUserInfo(),
  })
  const { refetchUserInfo } = useAccountContext()
  const isFollow = isFollowed(card.id.toString())

  return (
    <Card className="py-2 px-3 flex items-center justify-between" hover="bg">
      <div className="flex items-center gap-2">
        <Avatar src={card.logo} fallback={card.name.slice(-4)} />
        <div className="flex flex-col">
          <p className="font-bold">{card.name}</p>
          <p className="text-zinc-500 text-sm">{fmt.addr(card.name)}</p>
        </div>
      </div>
      <Button
        size="xs"
        variant="outline"
        onClick={() => {
          const id = card.id.toString()
          isFollow ? unfollow(id) : follow(id)
        }}
      >
        {isFollow ? `- ${t('unfollow')}` : `+ ${t('follow')}`}
      </Button>
    </Card>
  )
}

export const FollowCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} padding="md" className="flex gap-2 relative">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col justify-between">
            <Skeleton className="w-32 h-4 rounded-full" />
            <Skeleton className="w-20 h-4 rounded-full" />
          </div>
          <Skeleton className="w-14 h-6 absolute right-4 top-1/2 -translate-y-1/2" />
        </Card>
      ))}
    </div>
  )
}

export default FollowCard
