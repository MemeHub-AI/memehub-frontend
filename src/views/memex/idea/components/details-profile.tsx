import React from 'react'
import dayjs from 'dayjs'
import { AiOutlineEdit } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { useIdeaDetailsContext } from '@/contexts/memex/idea-details'
import { Button } from '@/components/ui/button'

export const IdeaDetailsProfile = () => {
  const { t } = useTranslation()
  const { details } = useIdeaDetailsContext()

  return (
    <>
      <div className="flex items-stretch space-x-2">
        <Avatar
          src={details?.user_logo}
          fallback={details?.user_name[0]}
          className="rounded"
          size={48}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="flex items-center justify-between w-full">
            <p className="">
              <span className="font-bold leading-none">
                {details?.user_name}
              </span>
              <span className="mx-1 text-zinc-400">·</span>
              <span className="text-zinc-400 text-sm">
                {dayjs(details?.created_at).fromNow()}
              </span>
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="#"
                className="text-purple-600 sm:hover:underline active:underline"
              >
                Blink
              </Link>
              <Link href="#" className="text-purple-600">
                <AiOutlineEdit size={18} />
              </Link>
            </div>
          </div>
          <Countdown
            createdAt={dayjs().unix()}
            duration={dayjs().add(10, 'second').unix() - dayjs().unix()}
            className="text-green-600"
          />
        </div>
      </div>
      <Button
        variant="yellow"
        shadow="none"
        size="sm"
        className="px-1 h-7 mt-2"
      >
        <AiOutlineEdit size={20} />
        {t('memex.token-detail')}
      </Button>
    </>
  )
}

export default IdeaDetailsProfile
