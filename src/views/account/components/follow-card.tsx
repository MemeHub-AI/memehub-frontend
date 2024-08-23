import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import type { UserFollow } from '@/api/user/types'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/use-user'
import { useAccountContext } from '@/contexts/account'
import { Routes } from '@/routes'
import { joinPaths } from '@/utils'

interface Props extends ComponentProps<typeof Card> {
  card: UserFollow
}

export const FollowCard = ({ card, onClick }: Props) => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { userInfo, refetchFollow, isOtherUser } = useAccountContext()
  const { follow, unfollow } = useUser({
    onFollowSuccess: refetchFollow,
  })

  return (
    <Card
      className="py-2 px-3 flex items-center justify-between"
      hover="bg"
      shadow="none"
      onClick={(e) => {
        router.push(joinPaths(Routes.Account, card.user.wallet_address))
        onClick?.(e)
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar src={card.logo} fallback={card.name[0]} />
        <div className="flex flex-col">
          <p className="font-bold">{card.name}</p>
          <p className="text-zinc-500 text-sm">{fmt.addr(card.name)}</p>
        </div>
      </div>
      {!isOtherUser && (
        <Button
          size="xs"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            const addr = (query.address || '') as string
            if (card.is_follower || userInfo?.is_follower) {
              return unfollow(
                card.user.wallet_address != null
                  ? `${card.user.wallet_address}`
                  : addr
              )
            }
            follow(card.user.wallet_address)
          }}
        >
          {card.is_follower || userInfo?.is_follower
            ? `${t('unfollow')}`
            : `${t('follow')}`}
        </Button>
      )}
    </Card>
  )
}

export const FollowCardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i} padding="md" className="flex gap-2 relative">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col justify-between">
        <Skeleton className="w-32 h-4 rounded-full" />
        <Skeleton className="w-20 h-4 rounded-full" />
      </div>
      <Skeleton className="w-14 h-6 absolute right-4 top-1/2 -translate-y-1/2" />
    </Card>
  ))
}

export default FollowCard
