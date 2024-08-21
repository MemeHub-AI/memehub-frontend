import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { ComponentProps } from 'react'

import { MemexIdeaComment } from '@/api/memex/types'
import { GridImages } from '@/components/grid-images'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const IdeaCommentCard = ({
  comment,
  className,
}: ComponentProps<'div'> & {
  comment: MemexIdeaComment | undefined
}) => {
  return (
    <div className={cn('flex space-x-2 border-b p-3', className)}>
      <Avatar src={comment?.user_logo} fallback={comment?.user_name[0]} />
      <div className="flex-1">
        <div className="flex items-center text-sm space-x-1">
          <span className="font-semibold">{comment?.user_name}</span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-400">
            {dayjs(comment?.created_at).fromNow()}
          </span>
        </div>
        <div className="break-all">{comment?.content}</div>
        {!isEmpty(comment?.image_urls) && (
          <GridImages
            urls={comment?.image_urls ?? []}
            className="border gap-0"
          />
        )}
      </div>
    </div>
  )
}

export default IdeaCommentCard
