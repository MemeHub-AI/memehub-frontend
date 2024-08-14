import { useState, type ComponentProps } from 'react'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { GoComment } from 'react-icons/go'

import { Progress } from '@/components/ui/progress'
import { useChainsStore } from '@/stores/use-chains-store'
import { Dialog, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { utilLang } from '@/utils/lang'
import { Button } from '@/components/ui/button'

interface Props {
  isLiked?: boolean
  likeAmount?: number
  commentAmount?: number
  chainName?: string
  progress?: number
  onLike?: () => void
  onUnlike?: () => void
}

export const PostFooter = ({
  isLiked,
  likeAmount = 0,
  commentAmount = 0,
  chainName = '',
  progress = 0,
  onLike,
  onUnlike,
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const [likeOpen, setLikeOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const { chainsMap } = useChainsStore()

  const chain = chainsMap[chainName]
  const reserveAmount = 0.009
  const reserveSymbol = 'BNB'
  const usdtAmount = 5
  const usdtSymbol = 'USDT'
  const tokenPercent = '0.5%'
  const duration = '48h'

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
            = {reserveAmount} {reserveSymbol}({usdtAmount} {usdtSymbol})
          </span>
        </div>
        <div className="text-zinc-500 text-sm">
          <p>{utilLang.replace(t('memex.like.desc'), [tokenPercent])}</p>
          <p>{utilLang.replace(t('memex.like.desc2'), [duration])}</p>
        </div>
        <DialogFooter className="flex-row space-x-4">
          <Button variant="yellow" shadow="none" size="sm">
            {t('confirm')}
          </Button>
          <Button shadow="none" size="sm" onClick={() => setLikeOpen(false)}>
            {t('cancel')}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        contentProps={{
          className: 'flex flex-col items-center',
          showClose: false,
          onClick: (e) => e.stopPropagation(),
        }}
      >
        <DialogTitle>{t('like-success')}</DialogTitle>
        <HeartFilledIcon className="w-20 h-20 text-red-500" />
        <Textarea rows={5} placeholder={t('post-comment')} />
        <DialogFooter className="flex-row space-x-4">
          <Button variant="yellow" shadow="none" size="sm">
            {t('confirm')}
          </Button>
          <Button shadow="none" size="sm" onClick={() => setCommentOpen(false)}>
            {t('cancel')}
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-1 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {isLiked ? (
              <HeartFilledIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon
                className="w-5 h-5"
                onClick={() => setLikeOpen(true)}
              />
            )}
            <span>{likeAmount}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <GoComment className="w-5 h-5" />
            <span>{commentAmount}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-sm">
          <img src={chain?.logo} alt="chain" className="w-5 h-5" />
          <span>{chain?.displayName}</span>
        </div>
      </div>

      <Progress
        value={progress}
        className="mt-2 h-5 rounded border-2 border-black"
        indicatorClass="bg-red-500"
      />
    </>
  )
}

export default PostFooter
