import { useState } from 'react'
import { GoComment } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PiShareFat } from 'react-icons/pi'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'

import { Routes } from '@/routes'
import { joinPaths } from '@/utils'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { BI_ZERO } from '@/constants/number'
import { CopyIcon } from '@/components/copy-icon'
import { LikeDialog } from './like-dialog'
import { CommentDialog } from './comment-dialog'
import { Button } from '@/components/ui/button'

export const IdeaCardLikeComment = ({
  onCommentSuccess,
}: {
  onCommentSuccess?: VoidFunction
}) => {
  const { t } = useTranslation()
  const [likeOpen, setLikeOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const { idea, ideaInfo, ideaStatus, chain, refetchInfo } =
    useIdeaCardContext()

  const { isLike = false, likeCount = BI_ZERO } = ideaInfo ?? {}
  const { isFailed, isSuccess } = ideaStatus

  const onOpenLike = () => {
    if (isLike) return toast.error(t('already-liked'))
    if (isFailed) return toast.error(t('alread-failed'))
    if (isSuccess) return toast.error(t('alread-ended'))

    setLikeOpen(true)
  }

  return (
    <>
      <LikeDialog
        open={likeOpen}
        onOpenChange={setLikeOpen}
        onLikeSuccess={() => {
          setLikeOpen(false)
          setCommentOpen(true)
          refetchInfo()
        }}
      />
      <CommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        onCommentSuccess={() => {
          setCommentOpen(false)
          onCommentSuccess?.()
        }}
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3 select-none">
          <Button
            variant="red"
            shadow="none"
            size="sm"
            className="flex items-center space-x-1 rounded-full px-3.5 shadow-lg shadow-zinc-400"
            disabled={isLike}
            onClick={(e) => {
              e.stopPropagation()
              onOpenLike()
            }}
          >
            <div className="flex items-center space-x-0.5 text-sm">
              {isLike ? (
                <HeartFilledIcon className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span>{likeCount.toString()}</span>
            </div>
          </Button>

          <button className="flex items-center space-x-1 text-sm cursor-pointer text-zinc-500 sm:hover:text-black duration-150">
            <GoComment className="w-5 h-5" />
            <span>{idea?.comment_count ?? 0}</span>
          </button>

          <CopyIcon
            size={20}
            content={joinPaths(
              location.origin,
              Routes.MemexIdea,
              idea?.hash || ''
            )}
            onClick={(e) => e.preventDefault()}
            className="text-zinc-500 sm:hover:text-black duration-150"
            icon={<PiShareFat size={20} />}
          />
        </div>

        <div className="flex items-center space-x-1 text-sm text-zinc-500">
          <img src={chain?.logo} alt="chain" className="w-5 h-5" />
          <span>{chain?.displayName}</span>
        </div>
      </div>
    </>
  )
}

export default IdeaCardLikeComment
