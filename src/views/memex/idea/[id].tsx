import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { useIdeaDetails } from './hooks/use-idea-details'
import { IdeaDetailsHeader } from './components/details-header'
import { IdeaDetailsProfile } from './components/details-profile'
import { IdeaDetailsProvider } from '@/contexts/memex/idea-details'
import { GridImages } from '@/components/grid-images'
import { IdeaLikeComment } from '../components/idea-like-comment'
import { IdeaCommentForm } from './components/details-comment-form'
import { IdeaCommentCard } from './components/details-comment-card'
import { useCommentList } from './hooks/use-comment-list'
import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaDetailsSkeleton } from './components/details-skeleton'
import { useIdeaInfo } from '../hooks/use-idea-info'
import { IdeaProgress } from '../components/idea-progress'

export const IdeaDetailsPage = () => {
  const { query } = useRouter()
  const id = query.id as string | undefined
  const postDetails = useIdeaDetails(id)
  const postComments = useCommentList(id)
  const { details, isLoadingDetails } = postDetails
  const { comments, isLoadingComments } = postComments

  const { progress } = useIdeaInfo(details?.ido_address)

  return (
    <IdeaDetailsProvider value={{ ...postDetails, ...postComments }}>
      <PrimaryLayout padding={false}>
        <CustomSuspense
          isPending={isLoadingDetails || isLoadingComments}
          fallback={<IdeaDetailsSkeleton />}
        >
          <IdeaDetailsHeader />
          <div className="px-3">
            <IdeaDetailsProfile />
            <div>{details?.content}</div>

            <GridImages urls={details?.image_urls ?? []} />
            <IdeaLikeComment idea={details} />
            <IdeaProgress value={progress} />
          </div>

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
