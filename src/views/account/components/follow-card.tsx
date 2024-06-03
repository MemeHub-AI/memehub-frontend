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

interface Props extends ComponentProps<'div'> {
  card: UserFollow
}

export const FollowCard = ({ card }: Props) => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { refetchUserInfo, userInfo } = useAccountContext()
  const { follow, unfollow } = useUser({
    onFollowSuccess: refetchUserInfo,
  })

  return (
    <Card
      className="py-2 px-3 flex items-center justify-between"
      hover="bg"
      shadow="none"
      onClick={() => {
        const href = fmt.toHref(Routes.Account, card.user.wallet_address)
        router.push(href)
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar src={card.logo} fallback={card.name[0]} />
        <div className="flex flex-col">
          <p className="font-bold">{card.name}</p>
          <p className="text-zinc-500 text-sm">{fmt.addr(card.name)}</p>
        </div>
      </div>
      <Button
        size="xs"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          const addr = (query.address || '') as string
          userInfo?.is_follower ? unfollow(addr) : follow(addr)
        }}
      >
        {userInfo?.is_follower ? `- ${t('unfollow')}` : `+ ${t('follow')}`}
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
