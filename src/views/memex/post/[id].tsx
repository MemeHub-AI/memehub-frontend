import React from 'react'
import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { usePostDetails } from './hooks/use-post-details'
import { DetailsHeader } from './components/details-header'
import { DetailsProfile } from './components/details-profile'
import { PostDetailsProvider } from '@/contexts/memex/post-details'
import { GridImages } from '@/components/grid-images'
import { PostFooter } from '../components/post-footer'
import { DetailsCommentForm } from './components/details-comment-form'
import { DetailsCommentCard } from './components/details-comment-card'
import { useCommentList } from './hooks/use-comment-list'

export const PostDetailsPage = () => {
  const { query } = useRouter()
  const id = query.id as string | undefined
  const postDetails = usePostDetails(id)
  const postComments = useCommentList(id)

  const { details } = postDetails
  const { comments } = postComments
  const progress = 80 // TODO/memex: calc from contract

  return (
    <PostDetailsProvider value={{ ...postDetails, ...postComments }}>
      <PrimaryLayout padding={false}>
        <DetailsHeader />
        <div className="px-3">
          <DetailsProfile />
          <div>{details?.content}</div>

          <GridImages urls={details?.image_urls ?? []} />
          <PostFooter
            isLiked={!!details?.is_liked}
            likeAmount={details?.like_amount}
            commentAmount={details?.comment_count}
            chainName={details?.chain || ''}
            progress={progress}
          />
        </div>

        <DetailsCommentForm />
        {comments.map((c) => (
          <DetailsCommentCard key={c?.created_at} comment={c} />
        ))}
      </PrimaryLayout>
    </PostDetailsProvider>
  )
}

export default PostDetailsPage
