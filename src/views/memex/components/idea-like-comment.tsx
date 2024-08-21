import { useMemo, useState, type ComponentProps } from 'react'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
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
import { useIdeaInfo } from '../hooks/use-idea-info'
import { getIdeaStatus } from '@/utils/memex/idea'
import { useChainInfo } from '@/hooks/use-chain-info'
import { memexIdeaConfig } from '@/config/memex/idea'
import { useClipboard } from '@/hooks/use-clipboard'
import { useAccount, useBalance } from 'wagmi'
import { BI_ZERO } from '@/constants/number'
import { CONTRACT_ERR } from '@/errors/contract'

interface Props {
  idea: MemexIdeaItem | undefined
  onCommentSuccess?: () => void
}

export const IdeaLikeComment = ({
  idea,
  onCommentSuccess,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const [likeOpen, setLikeOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const { chain, chainId } = useChainInfo(idea?.chain)
  const { form, isPending, onSubmit } = useCommentForm(idea?.hash || '', () => {
    setCommentOpen(false)
    onCommentSuccess?.()
  })
  const ideaInfo = useIdeaInfo(idea?.ido_address, chainId, idea?.memex_version)
  const { isLiking, like } = useIdeaLike(
    idea?.ido_address,
    chainId,
    idea?.memex_version,
    () => {
      setLikeOpen(false)
      setCommentOpen(true)
      ideaInfo.refetchInfo()
    }
  )
  const { isEnded } = useMemo(
    () => getIdeaStatus(idea, ideaInfo),
    [idea, ideaInfo]
  )
  const { copy } = useClipboard()
  const { address } = useAccount()
  const { data: { value = BI_ZERO } = {} } = useBalance({
    address,
    chainId,
  })
  const balance = formatEther(value)
  const {
    isLiked,
    likeValue,
    likedCount,
    durationSeconds,
    ownerPercent,
    userPercent,
  } = ideaInfo

  const onOpenLike = () => {
    if (isEnded) return toast.error(t('alread-ended'))

    setLikeOpen(true)
  }

  const onLike = () => {
    if (BigNumber(balance.toString()).lt(likeValue)) {
      CONTRACT_ERR.balanceInsufficient()
      return
    }
    like(likeValue)
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
            {utilLang.replace(t('memex.like.desc'), [
              idea?.is_creator ? ownerPercent : userPercent + '%',
            ])}
          </p>
          <p>
            {utilLang.replace(t('memex.like.desc2'), [
              Number(durationSeconds / 60 / 60).toFixed(2) + t('hours'),
            ])}
          </p>
        </div>
        <DialogFooter className="flex-row space-x-4">
          <Button
            variant="yellow"
            shadow="none"
            size="sm"
            disabled={isLiking}
            onClick={onLike}
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
            {isLiked ? (
              <HeartFilledIcon
                className="w-5 h-5 text-red-500"
                onClick={() => isLiked && toast.info(t('already-liked'))}
              />
            ) : (
              <HeartIcon className="w-5 h-5" onClick={onOpenLike} />
            )}
            <span>{likedCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm cursor-pointer">
            <GoComment className="w-5 h-5" />
            <span>{idea?.comment_count ?? 0}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              copy(location.href, { successTip: t('link-copy-success') })
            }}
          >
            <PiShareFat size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-1 text-sm">
          <img src={chain?.logo} alt="chain" className="w-5 h-5" />
          <span>{chain?.displayName}</span>
        </div>
      </div>
    </>
  )
}

export default IdeaLikeComment
