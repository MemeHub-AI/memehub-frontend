import React from 'react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Routes } from '@/routes'
import { UserListRes, UserListType } from '@/api/user/types'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { useScrollLoad } from '@/hooks/use-scroll-load'

interface Props {
  cards: UserListRes[UserListType.Notifications][]
  total: number
  isLoading: boolean
  isPending?: boolean
  onFetchNext?: () => void
}

export const MentionCards = (props: Props) => {
  const { cards, total, isLoading, isPending, onFetchNext } = props
  const { t } = useTranslation()
  const { noMore } = useScrollLoad({
    onFetchNext,
    hasMore: cards.length < total,
  })

  return (
    <CustomSuspense
      className="flex flex-col gap-3 max-sm:gap-2"
      isPending={isLoading}
      fallback={<CardSkeleton />}
      nullback={<p className="text-zinc-500">{t('mentions.empty')}</p>}
    >
      {cards.map((c, i) => (
        <MentionCard key={i} c={c} />
      ))}
      {isPending && <p className="text-zinc-500 text-center">{t('loading')}</p>}
      {noMore && <p className="text-zinc-500 text-center">{t('nomore')}</p>}
    </CustomSuspense>
  )
}

const MentionCard = ({ c }: { c: UserListRes[UserListType.Notifications] }) => {
  const { t } = useTranslation()

  return (
    <Card
      padding="md"
      className="flex items-center gap-3"
      hover="bg"
      shadow="none"
    >
      <ChatBubbleIcon width={20} height={20} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1 flex-wrap">
          <Link
            href={`${Routes.Account}/${c.user.wallet_address}`}
            className="font-bold text-black hover:underline"
          >
            {c.user?.name}
          </Link>
          <span className="text-zinc-500 max-sm:text-xs">
            {t('comment.mention-you')}:
          </span>
          <span className="max-sm:text-sm">#{c.id}</span>
        </div>
        <p>{c.content}</p>
      </div>
    </Card>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i} padding="md" className="flex gap-2 items-center">
      <Skeleton className="w-8 h-6" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-32 h-4" />
      </div>
    </Card>
  ))
}

export default MentionCards
