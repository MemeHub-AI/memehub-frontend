import { type ReactNode, type ComponentProps, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsLightningFill } from 'react-icons/bs'
import { zeroAddress } from 'viem'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BigNumber } from 'bignumber.js'

import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TokenDetailsCard } from './token-detail-card'
import { MemexIdeaItem } from '@/api/memex/types'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { EllipsisText } from '@/components/ellipsis-text'
import { GridImages } from '@/components/grid-images'
import { IdeaLikeComment } from './idea-like-comment'
import { useIdeaInfo } from '../hooks/use-idea-info'
import { IdeaProgress } from './idea-progress'
import { getIdeaStatus } from '@/utils/memex/idea'
import { useIdeaClaimRefund } from '../hooks/use-claim-refund'
import { useChainInfo } from '@/hooks/use-chain-info'
import { qs } from '@/hooks/use-fetch'
import { memexIdeaConfig } from '@/config/memex/idea'
import { useResponsive } from '@/hooks/use-responsive'

interface Props {
  idea: MemexIdeaItem | undefined
  mode?: 'list' | 'details'
  onCommentSuccess?: () => void
}

// TODO/memex: refactor
export const MemexIdeaCard = ({
  className,
  idea,
  mode = 'list',
  onCommentSuccess,
}: ComponentProps<'div'> & Props) => {
  const { content, image_urls, ...restIdea } = idea ?? {}
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { chain, chainId, chainName } = useChainInfo(idea?.chain)
  const ideaInfo = useIdeaInfo(idea?.ido_address, chainId, idea?.memex_version)
  const { hasDetails, isFailed, isSuccess, isProcessing, isEnded } = useMemo(
    () => getIdeaStatus(idea, ideaInfo),
    [idea, ideaInfo]
  )
  const [isList, isDetails] = useMemo(
    () => [mode === 'list', mode === 'details'],
    [mode]
  )
  const {
    likeValue,
    startAt,
    durationSeconds,
    progress,
    ownerPercent,
    userPercent,
    tokenAddr,
    overTime,
    waitingSeconds,

    refetchInfo,
  } = ideaInfo
  const {
    canRefund,
    canClaim,
    isClaimed,
    isRefunded,
    isPending,
    claim,
    refund,
    refetch,
  } = useIdeaClaimRefund(
    idea?.ido_address,
    chainId,
    idea?.memex_version,
    refetchInfo
  )
  const [isFailedWaiting, setIsFailedWaiting] = useState(false)
  const rewardPercent = useMemo(() => {
    if (idea?.is_creator && ideaInfo.isLiked) {
      return BigNumber(ownerPercent).plus(userPercent).toFixed(2)
    }

    return BigNumber(idea?.is_creator ? ownerPercent : userPercent).toFixed(2)
  }, [idea, ideaInfo])
  const { isLaptop } = useResponsive()

  const withDetailsLayout = (children: ReactNode) => {
    if (isDetails) {
      return (
        <div className="flex">
          {isProcessing && idea?.is_creator && (
            <div className="flex items-center space-x-2 absolute right-4 top-0 text-purple-600">
              <Link href="#" className="sm:hover:underline active:underline">
                Blink
              </Link>
              <Link
                href={Routes.MemexCreate + qs.stringify({ hash: idea.hash })}
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
                duration={durationSeconds}
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

  const onPushToAccount = () => {
    if (!idea?.user_address) return

    if (!isLaptop) {
      return router.push(
        fmt.toHref(Routes.MemexDetailsProfile, idea.user_address)
      )
    }
    router.push(fmt.toHref(Routes.Account, idea?.user_address))
  }

  return (
    <div
      className={cn(
        'flex px-3 py-3 border-b-2 relative',
        isList && 'cursor-pointer',
        className
      )}
      onClick={() => {
        if (!idea?.hash || isDetails) return
        router.push(fmt.toHref(Routes.MemexIdea, idea?.hash))
      }}
    >
      {isSuccess && !isFailedWaiting && (
        <Badge
          className={cn(
            'absolute top-4 right-2 px-0.5 bg-purple-600 hover:bg-purple-600',
            isDetails && 'top-0 right-3'
          )}
        >
          🚀 {t('memex.successed')}
        </Badge>
      )}

      {(isFailed || isFailedWaiting) && (
        <p className="absolute top-2 right-3 font-bold text-zinc-400">
          {t('fail').toUpperCase()}
        </p>
      )}

      {isList && (
        <Avatar
          src={idea?.user_logo}
          fallback={idea?.user_name?.[0]}
          className="rounded-md mr-2"
          onClick={(e) => {
            e.stopPropagation()
            onPushToAccount()
          }}
        />
      )}

      <div className="flex-1">
        {withDetailsLayout(
          <div className="space-x-1 text-zinc-500 text-sm leading-none max-w-[70%] inline-flex items-center">
            <span
              className="font-bold text-base text-black truncate hover:underline"
              onClick={(e) => {
                e.stopPropagation()
                onPushToAccount()
              }}
            >
              {idea?.user_name}
            </span>
            <span>·</span>
            <span>{dayjs(idea?.created_at).fromNow()}</span>
          </div>
        )}

        <div className="flex flex-col items-start">
          {isProcessing && isList && (
            <Countdown
              className="text-sm text-green-700"
              createdAt={startAt}
              duration={durationSeconds}
              onExpired={refetchInfo}
            />
          )}

          {!hasDetails &&
            idea?.is_creator &&
            (isProcessing || !isFailedWaiting) && (
              <Button
                variant="yellow"
                shadow="none"
                size="xs"
                className="py-3 mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push({
                    pathname: Routes.MemexCreateDetails,
                    query: { hash: idea.hash, chian: idea.chain },
                  })
                }}
              >
                <AiOutlineEdit size={16} className="mr-0.5" />
                {t('coin-detail')}
              </Button>
            )}

          {isSuccess && !hasDetails && !isFailedWaiting && (
            <div className="flex space-x-2 border-2 border-yellow-600 rounded mt-2 p-2 text-yellow-600 w-full">
              <BsLightningFill className="shrink-0" size={22} />
              <div className="text-sm font-bold w-full">
                <div className="leading-none flex flex-1 justify-between">
                  <span>{t('memex.done-desc1')}</span>
                  <Countdown
                    className="text-green-600 self-end"
                    createdAt={Number(overTime)}
                    duration={Number(waitingSeconds)}
                    onExpired={() => {
                      setIsFailedWaiting(true)
                      refetch()
                    }}
                  />
                </div>
                {idea?.is_creator ? (
                  <p>{t('memex.done-desc2')}</p>
                ) : (
                  <p>{t('memex.done-desc3')}</p>
                )}
                <p>{t('memex.done-desc4')}</p>
              </div>
            </div>
          )}

          {isSuccess && (canClaim || isClaimed) && (
            <Button
              variant="yellow"
              shadow="none"
              size="xs"
              className="py-3 mt-2 rounded-md"
              disabled={isPending || !canClaim || isClaimed}
              onClick={(e) => {
                e.stopPropagation()
                claim()
              }}
            >
              {isClaimed
                ? t('claimed')
                : isPending
                ? t('claiming')
                : `${t('pure.claim')} ${rewardPercent}% $${idea?.symbol}`}
            </Button>
          )}

          {(isFailed || isFailedWaiting) && (canRefund || isClaimed) && (
            <Button
              variant="yellow"
              shadow="none"
              size="xs"
              className="py-3 mt-2 rounded-md"
              disabled={isPending || !canRefund || isClaimed}
              onClick={(e) => {
                e.stopPropagation()
                refund()
              }}
            >
              {isRefunded
                ? t('refunded')
                : isPending
                ? t('refunding')
                : `${t('refund')} ${likeValue} ${chain?.native.symbol}`}
            </Button>
          )}
        </div>

        {isDetails ? (
          <p className="mt-1">{idea?.content}</p>
        ) : (
          <EllipsisText
            className="mt-1"
            showMoreClass="text-purple-600"
            maxLine={memexIdeaConfig.contentMaxLine}
            disableClick
          >
            {idea?.content}
          </EllipsisText>
        )}

        {hasDetails && (
          <TokenDetailsCard
            className="mt-1"
            details={restIdea as NonNullable<keyof typeof restIdea>}
            tokenAddr={tokenAddr}
            onClick={() => {
              if (tokenAddr === zeroAddress) return
              router.push(fmt.toHref(Routes.Main, chainName, tokenAddr))
            }}
          />
        )}

        <GridImages urls={image_urls} />

        <IdeaLikeComment idea={idea} onCommentSuccess={onCommentSuccess} />

        <IdeaProgress value={progress} />
      </div>
    </div>
  )
}

export default MemexIdeaCard
