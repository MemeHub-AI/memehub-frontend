import React, { type ComponentProps } from 'react'
import dayjs from 'dayjs'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { GoComment } from 'react-icons/go'
import { AiOutlineEdit } from 'react-icons/ai'

import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TokenDetailCard } from './token-detail-card'
import { MemexTweetItem, TweetStatus } from '@/api/memex/types'
import { cn } from '@/lib/utils'
import { useChainsStore } from '@/stores/use-chains-store'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'

interface Props {
  tweet?: MemexTweetItem
}

export const MemexTweet = ({
  className,
  tweet,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    user_logo,
    user_name,
    created_at,
    status,
    content,
    image_urls = [],
    is_liked,
    comment_count,
    like_amount,
    chain: chainName,
    symbol,
    name,
    ido_address,
  } = tweet ?? {}
  const isCreated = status === TweetStatus.Inactivated
  const isProcessing = status === TweetStatus.Activated
  const isSuccessed = status === TweetStatus.Done
  const { chainsMap } = useChainsStore()
  const chain = chainsMap[chainName || '']
  const hasToken = !!ido_address

  // TODO: use contract progress & reward
  const progress = 80
  const reward = '0.1%'

  const renderStatus = () => {
    if (isProcessing) {
      return (
        <Countdown
          createdAt={dayjs().unix()}
          duration={dayjs().add(2, 'day').unix() - dayjs().unix()}
          className="text-xs text-green-700"
        />
      )
    }

    if (isSuccessed) {
      return (
        <Button variant="yellow" shadow="none" size="xs" className="py-3 mt-1">
          {t('pure.claim')} {reward} ${symbol}
        </Button>
      )
    }

    return (
      <Button variant="yellow" shadow="none" size="xs" className="py-3 mt-1">
        <AiOutlineEdit size={16} className="mr-0.5" />
        {t('memex.token-detail')}
      </Button>
    )
  }

  return (
    <div
      className={cn('flex space-x-2 px-3 py-3 border-b-2 relative', className)}
    >
      <Avatar src={user_logo} fallback={user_name?.[0]} />

      <div className="flex-1">
        <div>
          <span className="font-bold">{user_name}</span>{' '}
          <span className="text-zinc-500 text-sm">
            · {dayjs(created_at).fromNow()}
          </span>
        </div>

        {isSuccessed && (
          <Badge className="absolute top-4 right-2 px-0.5 bg-purple-600">
            🚀 {t('memex.successed')}
          </Badge>
        )}

        {renderStatus()}

        <div className="mt-1">{content}</div>

        {hasToken && (
          <TokenDetailCard
            className="mt-1"
            name={name || ''}
            symbol={symbol || ''}
            logoUrl={tweet?.logo_url || ''}
            xUrl={tweet?.twitter_url || ''}
            tgUrl={tweet?.telegram_url || ''}
            websiteUrl={tweet?.website_url || ''}
            onClick={() =>
              router.push(
                fmt.toHref(Routes.Main, chain?.name || '', ido_address || '')
              )
            }
          />
        )}

        <div
          className="grid grid-cols-1 gap-1 rounded-md overflow-hidden mt-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              image_urls.length,
              2
            )}, minmax(0, 1fr))`,
          }}
        >
          {image_urls.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="poster"
              className="max-h-48 object-cover"
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm">
              {is_liked ? (
                <HeartFilledIcon
                  className="w-5 h-5 text-red-500"
                  onClick={() => {}}
                />
              ) : (
                <HeartIcon className="w-5 h-5" onClick={() => {}} />
              )}
              <span>{like_amount}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <GoComment className="w-5 h-5" />
              <span>{comment_count}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm">
            <img src={chain?.logo} alt="chain" className="w-5 h-5" />
            <span>{chain?.displayName}</span>
          </div>
        </div>

        <Progress
          value={progress}
          className="mt-2 h-5 rounded border-2 border-black"
          indicatorClass="bg-red-500"
        />
      </div>
    </div>
  )
}

export default MemexTweet
