import { useState, type ComponentProps } from 'react'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import { GoComment } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PiShareFat } from 'react-icons/pi'
import { BigNumber } from 'bignumber.js'
import { formatEther } from 'viem'

import { Dialog, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { utilLang } from '@/utils/lang'
import { Button } from '@/components/ui/button'
import { useIdeaLike } from '../hooks/use-idea-like'
import { useCommentForm } from '../idea/hooks/use-comment-form'
import { Form, FormField } from '@/components/ui/form'
import { MemexIdeaItem } from '@/api/memex/types'
import { useChainInfo } from '@/hooks/use-chain-info'
import { memexIdeaConfig } from '@/config/memex/idea'
import { useClipboard } from '@/hooks/use-clipboard'
import { Routes } from '@/routes'
import { joinPaths } from '@/utils'
import { IdeaHeartButton } from './idea-heart-button'
import { useIdeaStatus } from '../hooks/use-idea-status'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { BI_ZERO } from '@/constants/number'
import CopyIcon from '@/components/copy-icon'

interface Props {
  idea: MemexIdeaItem | undefined
  onLikeSuccess?: () => void
  onCommentSuccess?: () => void
}

export const IdeaLikeComment = ({
  idea,
  onLikeSuccess,
  onCommentSuccess,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const [likeOpen, setLikeOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const { chain, chainId } = useChainInfo(idea?.chain)
  const { ideaInfo } = useIdeaCardContext()

  const { form, isPending, onSubmit } = useCommentForm(idea?.hash || '', () => {
    setCommentOpen(false)
    onCommentSuccess?.()
  })

  const {
    isLike = false,
    ETHAmountOfLike = BI_ZERO,
    likeCount = BI_ZERO,
    startTime = BI_ZERO,
    endTime = BI_ZERO,
    ownerRatio = BI_ZERO,
    userAmount = BI_ZERO,
  } = ideaInfo ?? {}
  const likeValue = formatEther(ETHAmountOfLike)
  const startAt = Number(startTime)
  const endAt = Number(endTime)
  const duration = endAt - startAt
  const ownerPercent = BigNumber(ownerRatio.toString()).div(100).toFixed()

  const { isFailed, isEnded, isSuccess } = useIdeaStatus(idea, ideaInfo)
  const { copy } = useClipboard()
  const { isLiking, like } = useIdeaLike(
    idea?.ido_address,
    chainId,
    idea?.memex_version,
    () => {
      setLikeOpen(false)
      setCommentOpen(true)
      onLikeSuccess?.()
    }
  )

  const onOpenLike = () => {
    if (isLike) return toast.error(t('already-liked'))
    if (isFailed) return toast.error(t('alread-failed'))
    if (isEnded || isSuccess) return toast.error(t('alread-ended'))

    setLikeOpen(true)
  }

  return (
    <>
      <Dialog
        open={likeOpen}
        onOpenChange={setLikeOpen}
        contentProps={{
          className: 'flex flex-col items-center',
          showClose: false,
          onClick: (e) => e.stopPropagation(),
          onInteractOutside: (e) => e.preventDefault(),
        }}
      >
        <DialogTitle>{t('memex.like.confirm-title')}</DialogTitle>
        <img
          src="/images/create-success.png"
          alt="like"
          className="max-w-28 mx-atuo"
        />
        <div className="flex items-center space-x-1 font-semibold">
          <span>1</span>
          <HeartFilledIcon className="w-6 h-6 text-red-500" />
          <span>
            = {likeValue} {chain?.native.symbol}({memexIdeaConfig.likeUsdtFee}{' '}
            USDT)
          </span>
        </div>
        <div className="text-zinc-500 text-sm">
          <p>
            {idea?.is_creator
              ? utilLang.replace(t('memex.like.desc'), [ownerPercent + '%'])
              : utilLang.replace(t('memex.liker-desc'), [
                  memexIdeaConfig.likeUsdtFee,
                ])}
          </p>
          <p>
            {utilLang.replace(t('memex.like.desc2'), [
              Number(duration / 60 / 60).toFixed(2) + t('hours'),
            ])}
          </p>
        </div>
        <DialogFooter className="flex-row space-x-4">
          <Button
            variant="yellow"
            shadow="none"
            size="sm"
            disabled={isLiking}
            onClick={() => like(likeValue)}
          >
            {isLiking ? t('confirming') : t('confirm')}
          </Button>
          <Button
            shadow="none"
            size="sm"
            disabled={isLiking}
            onClick={() => setLikeOpen(false)}
          >
            {t('cancel')}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        contentProps={{
          className: 'p-0',
          showClose: false,
          onClick: (e) => e.stopPropagation(),
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center p-6 space-y-3"
          >
            <DialogTitle>{t('like-success')}</DialogTitle>
            <HeartFilledIcon className="w-20 h-20 text-red-500" />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <Textarea
                  autoFocus
                  rows={5}
                  placeholder={t('post-comment')}
                  {...field}
                />
              )}
            />

            <DialogFooter className="flex-row space-x-4">
              <Button
                variant="yellow"
                shadow="none"
                size="sm"
                type="submit"
                disabled={isPending}
              >
                {isPending ? t('comment.loading') : t('confirm')}
              </Button>
              <Button
                type="button"
                shadow="none"
                size="sm"
                disabled={isPending}
                onClick={() => setCommentOpen(false)}
              >
                {t('cancel')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </Dialog>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3 select-none">
          <div
            className="flex items-center space-x-1 text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <IdeaHeartButton
              likedCount={likeCount.toString()}
              isLiked={isLike}
              onClick={onOpenLike}
            />
          </div>

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

export default IdeaLikeComment
