import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'

import { Routes } from '@/routes'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components//ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { Dialog } from '@/components/ui/dialog'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { UserListRes, UserListType } from '@/api/user/types'

interface Props {
  c: UserListRes[UserListType.Replies]
  readonly?: boolean
  isActive?: boolean
  onLike?: (id: string) => void
  onUnlike?: (id: string) => void
  onReply?: (id: string) => void
  onAnchorClick?: (id: number) => void
}

export const CommentCard = (props: Props) => {
  const { c, readonly, isActive, onLike, onUnlike, onReply, onAnchorClick } =
    props
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const [open, setOpen] = useState(false)
  const tokenAddr = (query.address || '') as string

  return (
    <Card
      key={c.id}
      id={c.id.toString()}
      className={cn(
        'p-4 rounded-md cursor-[unset] max-sm:p-3 scroll-mt-[70px]',
        isActive && 'bg-zinc-200 hover:bg-zinc-200 animate-pulse'
      )}
      hover="bg"
    >
      {/* User profile */}
      <div
        className="flex items-center gap-2 group transition-all w-fit"
        onClick={() => {
          router.push(`${Routes.Account}/${c.user.wallet_address}`)
        }}
      >
        <Avatar
          src={c.user.logo}
          size={32}
          className="border border-zinc-400 cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="text-sm hover:underline cursor-pointer">
            {c.user.name}
          </span>
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
            <Link
              href={fmt.toAnchor(m)}
              key={i}
              className="ml-1.5 hover:underline"
              onClick={() => onAnchorClick?.(m)}
            >
              {fmt.toAnchor(m)}
            </Link>
          ))}
        </div>
      )}

      {/* Comment content */}
      <div className="">{c.content}</div>

      {/* Comment iamge */}
      {!isEmpty(c.img) && (
        <>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            contentProps={{ className: 'p-0 w-[50vw] border-none' }}
          >
            <img
              src={c.img}
              alt="image"
              className="w-full"
              onClick={() => setOpen(true)}
            />
          </Dialog>
          <img
            src={c.img}
            alt="image"
            className="rounded max-w-64 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </>
      )}

      {/* Like, comment */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1 cursor-pointer group">
          {c.is_liked ? (
            <HeartFilledIcon
              className="text-red-600 group-hover:stroke-black"
              onClick={() => onUnlike?.(tokenAddr)}
            />
          ) : (
            <HeartIcon
              className="text-zinc-400 group-hover:stroke-black"
              onClick={() => onLike?.(tokenAddr)}
            />
          )}
          <span className="text-sm mb-[0.5px]">{c.likes_count}</span>
        </div>
        {!readonly && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => onReply?.(tokenAddr)}
          >
            {t('replay')}
          </Button>
        )}
      </div>
    </Card>
  )
}
