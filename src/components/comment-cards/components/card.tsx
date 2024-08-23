import { type ComponentProps, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { MdOutlineMessage } from 'react-icons/md'

import { Routes } from '@/routes'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components//ui/avatar'
import { Tooltip } from '@/components/ui/tooltip'
import { Dialog } from '@/components/ui/dialog'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { UserListRes, UserListType } from '@/api/user/types'
import { Img } from '@/components/img'
import { joinPaths } from '@/utils'

interface Props extends ComponentProps<'div'> {
  c: UserListRes[UserListType.Comments]
  readonly?: boolean
  isActive?: boolean
  isLiking?: boolean
  isUnliking?: boolean
  disableToProfile?: boolean
  onLike?: (id: string) => void
  onUnlike?: (id: string) => void
  onReply?: (id: string) => void
  onAnchorClick?: (id: number) => void
}

export const CommentCard = (props: Props) => {
  const {
    c,
    readonly,
    isActive,
    isLiking,
    isUnliking,
    className,
    disableToProfile,
    onLike,
    onUnlike,
    onReply,
    onAnchorClick,
  } = props
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        key={c.id}
        id={c.id.toString()}
        hover="none"
        shadow="none"
        border="none"
        className={cn(
          'p-4 rounded-md cursor-[unset] max-sm:p-3 scroll-mt-[70px] relative',
          isActive && 'bg-zinc-200 animate-pulse',
          className
        )}
      >
        {/* User profile */}
        <div
          className="flex items-center group transition-all w-fit"
          onClick={() => {
            if (!c.user.wallet_address || disableToProfile) return
            router.push(joinPaths(Routes.Account, c.user.wallet_address))
          }}
        >
          <Avatar
            src={c.user.logo}
            size={32}
            className="border border-zinc-400 cursor-pointer"
          />
          <div className="flex flex-col ml-2">
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

        {/* Like, comment */}
        <div className="flex items-center absolute right-3 top-2">
          {!readonly && (
            <Tooltip tip={t('replay')}>
              <MdOutlineMessage
                size={16}
                className="text-zinc-500 hover:text-black cursor-pointer mt-1"
                onClick={() => onReply?.(c.id.toString())}
              />
            </Tooltip>
          )}

          {!readonly &&
            (c.liked ? (
              <div
                className="ml-2 flex items-center cursor-pointer group"
                onClick={() => {
                  if (isUnliking) return
                  onUnlike?.(c.id.toString())
                }}
              >
                <HeartFilledIcon className="text-red-600 group-hover:stroke-black" />
                <span className="ml-1 text-sm mb-[0.5px]">{c.likes_count}</span>
              </div>
            ) : (
              <div
                className="ml-2 flex items-center cursor-pointer group"
                onClick={() => {
                  if (isLiking) return
                  onLike?.(c.id.toString())
                }}
              >
                <HeartIcon className="text-zinc-400 group-hover:stroke-black" />
                <span className="ml-1 text-sm mb-[0.5px]">{c.likes_count}</span>
              </div>
            ))}
        </div>

        {/* Mentions */}
        {!!c.related_comment && (
          <div className="flex items-center text-xs text-zinc-400">
            {t('mentions')}:
            {[c.related_comment].map((m, i) => (
              <Link
                href={fmt.toAnchor(m)}
                key={i}
                className="ml-1.5 hover:underline"
                onClick={() => onAnchorClick?.(+m)}
              >
                {fmt.toAnchor(m)}
              </Link>
            ))}
          </div>
        )}

        {/* Comment content */}
        <div className="">{c.content}</div>

        {/* Comment iamge */}
        {!isEmpty(c.images) && (
          <>
            <Dialog
              open={open}
              onOpenChange={setOpen}
              contentProps={{
                className:
                  'p-0 w-[50vw] border-none max-sm:w-[85vw] max-h-[96vh] overflow-auto',
              }}
            >
              <Img
                src={c.images?.[0]}
                alt="image"
                className="w-full"
                onClick={() => setOpen(true)}
              />
            </Dialog>

            <Img
              src={c.images?.[0]}
              alt="img"
              className="rounded mt-1 max-w-64 max-h-96 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </>
        )}
      </Card>
    </>
  )
}
