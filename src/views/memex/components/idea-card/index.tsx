import { type ComponentProps, useMemo } from 'react'
import { formatEther, zeroAddress } from 'viem'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

import { Avatar } from '@/components/ui/avatar'
import { TokenDetailsCard } from '../token-detail-card'
import { MemexIdeaItem, MemexListType } from '@/api/memex/types'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { EllipsisText } from '@/components/ellipsis-text'
import { GridImages } from '@/components/grid-images'
import { IdeaCardLikeComment } from './like-comment'
import { IdeaProgress } from '../idea-progress'
import { useChainInfo } from '@/hooks/use-chain-info'
import { memexIdeaConfig } from '@/config/memex/idea'
import { joinPaths } from '@/utils'
import { IdoInfo } from '../../hooks/use-ido-infos'
import { useIdeaStatus } from '../../hooks/use-idea-status'
import { IdeaCardProvider } from '@/contexts/memex/idea-card'
import { IdeaCardBadge } from './badge'
import { IdeaStatusCountdown } from './status-countdown'
import { IdeaRefundClaimButton } from './refund-claim-button'
import { IdeaCardProfile } from './profile'
import { BI_ZERO } from '@/constants/number'

interface Props {
  idea: MemexIdeaItem | undefined
  ideaInfo: IdoInfo | undefined
  mode?: 'list' | 'details'
  listType?: MemexListType
  refetchInfo?: VoidFunction
  onCommentSuccess?: VoidFunction
}

export const MemexIdeaCard = ({
  className,
  mode = 'list',
  idea,
  ideaInfo,
  listType,
  refetchInfo = () => {},
  onCommentSuccess,
}: ComponentProps<'div'> & Props) => {
  const { content, image_urls, ...restIdea } = idea ?? {}
  const {
    token = zeroAddress,
    startTime = BI_ZERO,
    endTime = BI_ZERO,
    ETHAmountOfLike = BI_ZERO,
    ownerRatio = BI_ZERO,
    userAmount = BI_ZERO,
  } = ideaInfo ?? {}
  const likeValue = formatEther(ETHAmountOfLike)
  const startAt = Number(startTime)
  const endAt = Number(endTime)
  const duration = endAt - startAt
  const ownerPercent = BigNumber(ownerRatio.toString()).div(100).toFixed()
  const userClaimAmount = formatEther(userAmount)

  const { query, ...router } = useRouter()
  const [isList, isDetails, isMyIdeas] = useMemo(
    () => [mode === 'list', mode === 'details', listType === MemexListType.My],
    [mode, listType]
  )
  const { chain, chainId, chainName } = useChainInfo(idea?.chain)
  const ideaStatus = useIdeaStatus(idea, ideaInfo)
  const isNonPay = isMyIdeas && !ideaInfo

  const onPushToAccount = () => {
    if (!idea?.user_address) return
    router.push(joinPaths(Routes.Account, idea?.user_address))
  }

  return (
    <IdeaCardProvider
      value={{
        idea,
        ideaInfo,
        ideaStatus,
        isList,
        isDetails,
        isMyIdeas,
        isNonPay,
        chain,
        chainId,
        startAt,
        endAt,
        duration,
        likeValue,
        ownerPercent,
        userClaimAmount,
        refetchInfo,
      }}
    >
      <div
        className={cn(
          'lg:flex px-3 py-3 relative border-b duration-150',
          isList && 'cursor-pointer sm:hover:bg-zinc-50',
          className
        )}
        onClick={() => {
          if (!idea?.hash || isDetails) return
          router.push(joinPaths(Routes.MemexIdea, idea?.hash))
        }}
      >
        <IdeaCardBadge />
        <div className="max-lg:flex max-lg:space-x-2">
          {isList && (
            <Avatar
              src={idea?.user_logo}
              fallback={idea?.user_name?.[0]}
              className={cn(
                'rounded-md mr-2',
                'max-lg:rounded-full max-lg:mr-2 max-lg:w-11 max-lg:h-11'
              )}
              onClick={(e) => {
                e.stopPropagation()
                onPushToAccount()
              }}
            />
          )}
          <div className="flex items-start flex-col flex-1 lg:hidden">
            <IdeaCardProfile onPush={onPushToAccount} />
            <IdeaStatusCountdown />
            <IdeaRefundClaimButton />
          </div>
        </div>

        <div className="flex-1">
          <div className="max-lg:hidden">
            <IdeaCardProfile onPush={onPushToAccount} />
          </div>

          <div className="flex flex-col items-start max-lg:hidden">
            <IdeaStatusCountdown />
            <IdeaRefundClaimButton />
          </div>

          <div className={cn(isNonPay && 'mt-4')}>
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
          </div>

          {ideaStatus.hasDetails && (
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

          <GridImages urls={image_urls} onClick={(e) => e.stopPropagation()} />
          <IdeaCardLikeComment onCommentSuccess={onCommentSuccess} />
          <IdeaProgress />
        </div>
      </div>
    </IdeaCardProvider>
  )
}

export default MemexIdeaCard
