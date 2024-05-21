import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'

import type { TokenCommentListRes } from '@/api/token/types'

import { Routes } from '@/routes'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components//ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

interface Props {
  c: TokenCommentListRes
  readonly?: boolean
  onLike?: (id: string) => void
  onUnlike?: (id: string) => void
  onReply?: (id: string) => void
}

export const CommentCard = (props: Props) => {
  const { c, readonly, onLike, onUnlike, onReply } = props
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Card
      key={c.id}
      id={c.id.toString()}
      className="p-4 rounded-md cursor-[unset] max-sm:p-3"
      hover="bg"
    >
      {/* User profile */}
      <div
        className="flex items-center gap-2 group transition-all w-fit"
        onClick={() => router.push(`${Routes.Account}/${c.user.id}`)}
      >
        <Avatar
          src={c.user.logo}
          size={32}
          className="border border-zinc-400"
        />
        <div className="flex flex-col">
          <span className="text-sm hover:underline">{c.user.name}</span>
          <Tooltip
            tip={dayjs(c.created_at).format('YYYY/MM/DD HH:mm:ss')}
            triggerProps={{ asChild: true }}
          >
            <span className="text-zinc-400 text-xs cursor-pointer">
              {dayjs(c.created_at).fromNow()}
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Mentions */}
      {!isEmpty(c.related_comments) && (
        <div className="flex items-center text-xs text-zinc-400">
          {t('mentions')}:
          {c.related_comments.map((m, i) => (
            <Link key={i} className="ml-1" href={`#${m}`}>
              #{m}
            </Link>
          ))}
        </div>
      )}

      {/* Comment content */}
      <div className="">{c.content}</div>

      {/* Like, comment */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1 cursor-pointer group">
          {c.is_liked ? (
            <HeartFilledIcon
              className="text-red-600 group-hover:stroke-black"
              onClick={() => onUnlike?.(c.id.toString())}
            />
          ) : (
            <HeartIcon
              className="text-zinc-400 group-hover:stroke-black"
              onClick={() => onLike?.(c.id.toString())}
            />
          )}
          <span className="text-sm mb-[0.5px]">{c.likes_count}</span>
        </div>
        {!readonly && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => onReply?.(c.id.toString())}
          >
            {t('replay')}
          </Button>
        )}
      </div>
    </Card>
  )
}
