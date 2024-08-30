import { type ReactNode } from 'react'
import Link from 'next/link'
import { AiOutlineEdit } from 'react-icons/ai'

import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { Routes } from '@/routes'
import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { simplifyFromNow } from '@/utils/day'

export const IdeaCardProfile = ({ onPush }: { onPush: VoidFunction }) => {
  const { idea, isDetails, ideaStatus, startAt, duration, refetchInfo } =
    useIdeaCardContext()
  const { isCreator, isProcessing } = ideaStatus

  const withDetailsLayout = (children: ReactNode) => {
    if (isDetails) {
      return (
        <div className="flex">
          {isCreator && isProcessing && (
            <div className="flex items-center space-x-2 absolute right-4 top-0 text-purple-600">
              {/* TODO: uncomment? */}
              {/* <Link href="#" className={linkStyle()}>
                Blink
              </Link> */}
              <Link
                href={{
                  pathname: Routes.MemexCreate,
                  query: { hash: idea?.hash },
                }}
              >
                <AiOutlineEdit size={20} />
              </Link>
            </div>
          )}
          <Avatar
            src={idea?.user_logo}
            fallback={idea?.user_name?.[0]}
            className="rounded-md mr-2"
          />
          <div className="w-full">
            {children}
            {isProcessing && (
              <Countdown
                createdAt={startAt}
                duration={duration}
                className="text-sm text-green-700"
                onExpired={refetchInfo}
              />
            )}
          </div>
        </div>
      )
    }

    return children
  }

  return withDetailsLayout(
    <div className="space-x-1 text-zinc-500 text-sm leading-none max-w-[70%] inline-flex items-center">
      <span
        className="font-bold text-base text-black truncate hover:underline"
        onClick={(e) => {
          e.stopPropagation()
          onPush()
        }}
      >
        {idea?.user_name}
      </span>
      <span>·</span>
      <span className="shrink-0">{simplifyFromNow(idea?.created_at)}</span>
    </div>
  )
}

export default IdeaCardProfile
