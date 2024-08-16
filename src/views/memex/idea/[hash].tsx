import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
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

export const IdeaDetailsPage = () => {
  const { query } = useRouter()
  const hash = query.hash as string
  const ideaDetails = useIdeaDetails(hash)
  const ideaComments = useCommentList(hash)
  const { details, isLoadingDetails } = ideaDetails
  const { comments, isLoadingComments, refetchComments } = ideaComments
  const ideaInfo = useIdeaInfo(details?.ido_address)

  return (
    <IdeaDetailsProvider
      value={{ ...ideaDetails, ...ideaComments, ...ideaInfo }}
    >
      <PrimaryLayout mainClass="flex" padding={false}>
        <CustomSuspense
          isPending={isLoadingDetails || isLoadingComments}
          fallback={<IdeaDetailsSkeleton />}
          className="w-full sm:max-w-sm"
        >
          <IdeaDetailsHeader />
          <MemexIdeaCard
            idea={details}
            onCommentSuccess={refetchComments}
            className="py-0 border-none"
            mode="details"
          />
          <IdeaCommentForm />
          {comments.map((c) => (
            <IdeaCommentCard key={c?.created_at} comment={c} />
          ))}
        </CustomSuspense>
      </PrimaryLayout>
    </IdeaDetailsProvider>
  )
}

export default IdeaDetailsPage
