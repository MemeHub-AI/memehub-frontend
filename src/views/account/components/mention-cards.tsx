import React from 'react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Routes } from '@/routes'
import { UserMyInfoNotify } from '@/api/user/types'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  cards: UserMyInfoNotify[]
  isPending: boolean
}

export const MentionCards = ({ cards, isPending }: Props) => {
  return (
    <CustomSuspense
      className="flex flex-col gap-3 max-sm:gap-2"
      isPending={isPending}
      fallback={<CardSkeleton />}
    >
      {cards.map((c, i) => (
        <MentionCard key={i} c={c} />
      ))}
    </CustomSuspense>
  )
}

const MentionCard = ({ c }: { c: UserMyInfoNotify }) => {
  const { t } = useTranslation()

  return (
    <Card padding="md" className="flex items-center gap-3" hover="bg">
      <ChatBubbleIcon width={20} height={20} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1 flex-wrap">
          <Link
            href={`${Routes.Account}/${c.user?.id}`}
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
  return (
    <div className="flex flex-col gap-3 max-sm:gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} padding="md" className="flex gap-2 items-center">
          <Skeleton className="w-8 h-8" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default MentionCards
