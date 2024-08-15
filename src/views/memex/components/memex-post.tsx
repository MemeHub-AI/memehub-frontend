import React, { type ComponentProps } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsLightningFill } from 'react-icons/bs'

import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TokenDetailCard } from './token-detail-card'
import { MemexPostItem, PostStatus } from '@/api/memex/types'
import { cn } from '@/lib/utils'
import { useChainsStore } from '@/stores/use-chains-store'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { EllipsisText } from '@/components/ellipsis-text'
import { GridImages } from '@/components/grid-images'
import { PostFooter } from './post-footer'

interface Props {
  post?: MemexPostItem
}

export const MemexPost = ({
  className,
  post,
}: ComponentProps<'div'> & Props) => {
  const { chain: chainName, content, image_urls, ...p } = post ?? {}
  const { t } = useTranslation()
  const router = useRouter()
  const { chainsMap } = useChainsStore()

  const hasTokenDetails =
    !!post?.symbol && !!post?.name && !!post.logo_url && !!post.description

  // TODO/memex: use contract progress & reward
  const progress = 80
  const reward = '0.1%'

  const isProcessing = post?.status === PostStatus.Activated
  const isDone = post?.status === PostStatus.Done
  const isSuccess = progress >= 100
  const isFailed = false

  const chain = chainsMap[chainName || '']
  const hasToken = !!post?.ido_address

  const renderDoneButton = () => {
    if (isSuccess) {
      return (
        <Button variant="yellow" shadow="none" size="xs" className="py-3 mt-1">
          {t('pure.claim')} {reward} ${post?.symbol}
        </Button>
      )
    }

    if (isFailed) {
      return (
        <Button variant="yellow" shadow="none" size="xs" className="py-3 mt-1">
          {t('refund')} {reward} ${post?.symbol}
        </Button>
      )
    }
  }

  return (
    <div
      className={cn('flex space-x-2 px-3 py-3 border-b-2 relative', className)}
    >
      {isDone && (
        <Badge className="absolute top-4 right-2 px-0.5 bg-purple-600">
          🚀 {t('memex.successed')}
        </Badge>
      )}

      <Avatar
        src={post?.user_logo}
        fallback={post?.user_name?.[0]}
        className="rounded-md"
      />

      <div
        className="flex-1"
        onClick={() =>
          router.push(fmt.toHref(Routes.MemexPost, post?.hash ?? ''))
        }
      >
        <div className="space-x-1 text-zinc-500 text-sm">
          <span className="font-bold text-base text-black">
            {post?.user_name}
          </span>
          <span>·</span>
          <span className="">{dayjs(post?.created_at).fromNow()}</span>
        </div>

        <div className="flex flex-col items-start">
          {isProcessing && (
            <Countdown
              createdAt={dayjs().unix()}
              duration={dayjs().add(2, 'day').unix() - dayjs().unix()}
              className="text-xs text-green-700"
            />
          )}

          {!hasTokenDetails && post?.is_creator && (
            <Button
              variant="yellow"
              shadow="none"
              size="xs"
              className="py-3 mt-1"
            >
              <AiOutlineEdit size={16} className="mr-0.5" />
              {t('memex.token-detail')}
            </Button>
          )}

          {isDone && !hasTokenDetails && (
            <div className="flex space-x-2 border-2 border-yellow-600 rounded mt-2 p-2 text-yellow-600 w-full">
              <BsLightningFill className="shrink-0" size={22} />
              <div className="text-sm font-bold w-full">
                <div className="leading-none flex flex-1 justify-between">
                  <span>{t('memex.done-desc1')}</span>
                  <Countdown
                    createdAt={dayjs().unix()}
                    duration={dayjs().add(1, 'hour').unix() - dayjs().unix()}
                    className="text-green-600 self-end"
                  />
                </div>
                {post?.is_creator ? (
                  <p>{t('memex.done-desc2')}</p>
                ) : (
                  <p>{t('memex.done-desc3')}</p>
                )}
                <p>{t('memex.done-desc4')}</p>
              </div>
            </div>
          )}

          {renderDoneButton()}
        </div>

        <EllipsisText
          className="mt-1"
          showMoreClass="text-purple-600"
          maxLine={8}
        >
          {post?.content}
        </EllipsisText>

        {hasToken && (
          <TokenDetailCard
            className="mt-1"
            details={p as NonNullable<keyof typeof p>}
            onClick={() =>
              router.push(
                fmt.toHref(
                  Routes.Main,
                  chain?.name || '',
                  post?.ido_address || ''
                )
              )
            }
          />
        )}

        <GridImages urls={image_urls} />
        <PostFooter
          isLiked={!!post?.is_liked}
          likeAmount={post?.like_amount}
          commentAmount={post?.comment_count}
          chainName={post?.chain || ''}
          progress={progress}
          idoAddr={post?.ido_address}
          isCreator={!!post?.is_creator}
        />
      </div>
    </div>
  )
}

export default MemexPost
