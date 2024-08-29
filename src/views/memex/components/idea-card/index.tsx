import { type ReactNode, type ComponentProps, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsLightningFill } from 'react-icons/bs'
import { formatEther, zeroAddress } from 'viem'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BigNumber } from 'bignumber.js'

import { Avatar } from '@/components/ui/avatar'
import { Countdown } from '@/components/countdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TokenDetailsCard } from '../token-detail-card'
import { MemexIdeaItem, MemexListType } from '@/api/memex/types'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { EllipsisText } from '@/components/ellipsis-text'
import { GridImages } from '@/components/grid-images'
import { IdeaLikeComment } from '../idea-like-comment'
import { IdeaProgress } from '../idea-progress'
import { useIdeaClaimRefund } from '../../hooks/use-claim-refund'
import { useChainInfo } from '@/hooks/use-chain-info'
import { memexIdeaConfig } from '@/config/memex/idea'
import { joinPaths } from '@/utils'
import { qs } from '@/utils/qs'
import { IdoInfo } from '../../hooks/use-ido-infos'
import { BI_ZERO } from '@/constants/number'
import { useIdeaStatus } from '../../hooks/use-idea-status'
import { IdeaCardProvider } from '@/contexts/memex/idea-card'

interface Props {
  idea: MemexIdeaItem | undefined
  info: IdoInfo | undefined
  mode?: 'list' | 'details'
  listType?: MemexListType
  refetchInfo?: () => void
  onCommentSuccess?: () => void
}

// TODO/memex: refactor
export const MemexIdeaCard = ({
  className,
  mode = 'list',
  idea,
  info,
  listType,
  refetchInfo,
  onCommentSuccess,
}: ComponentProps<'div'> & Props) => {
  const { content, image_urls, ...restIdea } = idea ?? {}
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { chain, chainId, chainName } = useChainInfo(idea?.chain)
  const [isList, isDetails, isMyIdeas] = useMemo(
    () => [mode === 'list', mode === 'details', listType === MemexListType.My],
    [mode, listType]
  )

  const {
    token = zeroAddress,
    startTime = BI_ZERO,
    endTime = BI_ZERO,
    overTime = BI_ZERO,
    waitingTime = BI_ZERO,
    ownerRatio = BI_ZERO,
    ETHAmountOfLike = BI_ZERO,
    likeCount = BI_ZERO,
    maxCount = BI_ZERO,
    initAmountIn = BI_ZERO,
    isCanClaimToken = false,
    isClaimToken = false,
    isCanWithdraw = false,
    isWithdrawETH = false,
    isHasInitWithdraw = false,
    isInitWithdrawETH = false,
  } = info ?? {}
  const startAt = Number(startTime)
  const endAt = Number(endTime)
  const duration = endAt - startAt
  const initialAmount = formatEther(initAmountIn)

  const percent = BigNumber(likeCount.toString())
    .div(maxCount.toString())
    .multipliedBy(100)
  const progress = percent.lte(0) || percent.isNaN() ? 0 : percent.toFixed()

  const { hasDetails, isFailed, isSuccess, isProcessing, isEnded } =
    useIdeaStatus(idea, info)

  const { isPending, claim, refund, refundInitial } = useIdeaClaimRefund(
    idea?.ido_address,
    chainId,
    idea?.memex_version
  )

  const [isFailedWaiting, setIsFailedWaiting] = useState(false)
  const rewardPercent = useMemo(() => {
    return ownerRatio.toString()
  }, [idea, info])

  const withDetailsLayout = (children: ReactNode) => {
    if (isDetails) {
      return (
        <div className="flex">
          {isProcessing && idea?.is_creator && (
            <div className="flex items-center space-x-2 absolute right-4 top-0 text-purple-600">
              {/* TODO: open? */}
              {/* <Link href="#" className={linkStyle()}>
                Blink
              </Link> */}
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

  const onPushToAccount = () => {
    if (!idea?.user_address) return
    router.push(joinPaths(Routes.Account, idea?.user_address))
  }

  return (
    <IdeaCardProvider value={{ idea, ideaInfo: info }}>
      <div
        className={cn(
          'flex px-3 py-3 relative border-b-2 duration-150',
          isList && 'cursor-pointer sm:hover:bg-zinc-50',
          className
        )}
        onClick={() => {
          if (!idea?.hash || isDetails) return
          router.push(joinPaths(Routes.MemexIdea, idea?.hash))
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
              <span className="shrink-0">
                {dayjs(idea?.created_at).fromNow()}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            {isProcessing && isList && (
              <Countdown
                className="text-sm text-green-700"
                createdAt={startAt}
                duration={duration}
                onExpired={refetchInfo}
              />
            )}

            {!hasDetails &&
              idea?.is_creator &&
              (isProcessing || !isFailedWaiting) &&
              !isFailed && (
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
                      duration={Number(waitingTime)}
                      onExpired={() => {
                        setIsFailedWaiting(true)
                        refetchInfo?.()
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

            {isSuccess && (isCanClaimToken || isClaimToken) && (
              <Button
                variant="yellow"
                shadow="none"
                size="xs"
                className="py-3 mt-2 rounded-md"
                disabled={isPending || !isCanClaimToken || isClaimToken}
                onClick={(e) => {
                  e.stopPropagation()
                  claim()
                }}
              >
                {isClaimToken
                  ? t('claimed')
                  : isPending
                  ? t('claiming')
                  : `${t('pure.claim')} ${rewardPercent}% $${idea?.symbol}`}
              </Button>
            )}

            {(isFailed || isFailedWaiting) &&
              (isCanWithdraw || isWithdrawETH) && (
                <Button
                  variant="yellow"
                  shadow="none"
                  size="xs"
                  className="py-3 mt-2 rounded-md"
                  disabled={isPending || !isCanWithdraw || isWithdrawETH}
                  onClick={(e) => {
                    e.stopPropagation()
                    refund()
                  }}
                >
                  {isInitWithdrawETH
                    ? t('refunded')
                    : isPending
                    ? t('refunding')
                    : `${t('refund')} ${ETHAmountOfLike} ${
                        chain?.native.symbol
                      }`}
                </Button>
              )}

            {(isFailed || isFailedWaiting) &&
              (isHasInitWithdraw || isInitWithdrawETH) &&
              idea?.is_creator && (
                <Button
                  variant="yellow"
                  shadow="none"
                  size="xs"
                  className="py-3 mt-2 rounded-md"
                  disabled={
                    isPending || isInitWithdrawETH || !isHasInitWithdraw
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    refundInitial()
                  }}
                >
                  {isInitWithdrawETH
                    ? t('refunded-initial-buy')
                    : isPending
                    ? t('refunding')
                    : `${t('refund-initial-buy')} ${initialAmount} ${
                        chain?.native.symbol
                      }`}
                </Button>
              )}
          </div>
          {isDetails ? (
            <p className="mt-1 whitespace-pre-line">{idea?.content}</p>
          ) : (
            <EllipsisText
              className="mt-1"
              showMoreClass="text-purple-600"
              maxLine={memexIdeaConfig.contentMaxLine}
              disableClickShowMore
            >
              {idea?.content}
            </EllipsisText>
          )}
          {hasDetails && (
            <TokenDetailsCard
              className="mt-1"
              details={restIdea as NonNullable<keyof typeof restIdea>}
              tokenAddr={token}
              onClick={() => {
                if (token === zeroAddress) return
                router.push(joinPaths(Routes.Main, chainName, token))
              }}
            />
          )}

          <GridImages urls={image_urls} />

          <IdeaLikeComment
            idea={idea}
            onLikeSuccess={refetchInfo}
            onCommentSuccess={onCommentSuccess}
          />

          <IdeaProgress value={progress} className="!h-5" />
        </div>
      </div>
    </IdeaCardProvider>
  )
}

export default MemexIdeaCard
