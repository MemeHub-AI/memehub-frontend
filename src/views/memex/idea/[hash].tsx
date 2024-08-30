import { useRouter } from 'next/router'

import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaDetailsProvider } from '@/contexts/memex/idea-details'
import { useIdeaDetails } from './hooks/use-idea-details'
import { IdeaDetailsHeader } from './components/details-header'
import { IdeaCommentForm } from './components/details-comment-form'
import { IdeaCommentCard } from './components/details-comment-card'
import { useCommentList } from './hooks/use-comment-list'
import { IdeaDetailsSkeleton } from './components/details-skeleton'
import { useIdeaInfo } from '../hooks/use-idea-info'
import { MemexIdeaCard } from '../components/idea-card'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getMemexLayout } from '..'

export const IdeaDetailsPage = () => {
  const { query } = useRouter()
  const hash = query.hash as string
  const ideaDetails = useIdeaDetails(hash)
  const ideaComments = useCommentList(hash)
  const { details, isLoadingDetails } = ideaDetails
  const { comments, isLoadingComments, refetchComments } = ideaComments
  const { chainId } = useChainInfo(details?.chain)
  const ideaInfo = useIdeaInfo(
    chainId,
    details?.memex_version,
    details?.ido_address
  )

  return (
    <IdeaDetailsProvider
      value={{ ...ideaDetails, ...ideaComments, ...ideaInfo }}
    >
      <CustomSuspense
        isPending={isLoadingDetails || isLoadingComments}
        fallback={<IdeaDetailsSkeleton />}
        className="w-full sm:max-w-2xl"
      >
        <IdeaDetailsHeader />
        <MemexIdeaCard
          mode="details"
          className="py-0 border-none"
          idea={details}
          ideaInfo={ideaInfo.ideaInfo}
          refetchInfo={ideaInfo.refetchInfo}
          onCommentSuccess={refetchComments}
        />
        <IdeaCommentForm />
        {comments.map((c) => (
          <IdeaCommentCard key={c?.created_at} comment={c} />
        ))}
      </CustomSuspense>
    </IdeaDetailsProvider>
  )
}

IdeaDetailsPage.getLayout = getMemexLayout

export default IdeaDetailsPage
