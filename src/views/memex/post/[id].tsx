import React from 'react'
import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { usePostDetails } from './hooks/use-post-details'
import { DetailsHeader } from './components/details-header'
import { DetailsProfile } from './components/details-profile'
import { PostDetailsProvider } from '@/contexts/memex/post-details'
import { GridImages } from '@/components/grid-images'
import { PostLikeComment } from '../components/post-like-comment'
import { DetailsCommentForm } from './components/details-comment-form'
import { DetailsCommentCard } from './components/details-comment-card'
import { useCommentList } from './hooks/use-comment-list'
import { CustomSuspense } from '@/components/custom-suspense'
import { DetailsSkeleton } from './components/details-skeleton'
import { useIdeaInfo } from '../hooks/use-idea-info'
import { PostProgress } from '../components/post-progress'

export const PostDetailsPage = () => {
  const { query } = useRouter()
  const id = query.id as string | undefined
  const postDetails = usePostDetails(id)
  const postComments = useCommentList(id)
  const { details, isLoadingDetails } = postDetails
  const { comments, isLoadingComments } = postComments

  const { progress } = useIdeaInfo(details?.ido_address)

  return (
    <PostDetailsProvider value={{ ...postDetails, ...postComments }}>
      <PrimaryLayout padding={false}>
        <CustomSuspense
          isPending={isLoadingDetails || isLoadingComments}
          fallback={<DetailsSkeleton />}
        >
          <DetailsHeader />
          <div className="px-3">
            <DetailsProfile />
            <div>{details?.content}</div>

            <GridImages urls={details?.image_urls ?? []} />
            <PostLikeComment post={details} />
            <PostProgress value={progress} />
          </div>

          <DetailsCommentForm />
          {comments.map((c) => (
            <DetailsCommentCard key={c?.created_at} comment={c} />
          ))}
        </CustomSuspense>
      </PrimaryLayout>
    </PostDetailsProvider>
  )
}

export default PostDetailsPage
