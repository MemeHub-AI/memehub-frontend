import { type ComponentProps } from 'react'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { utilLang } from '@/utils/lang'
import { Button } from '@/components/ui/button'
import { memexIdeaConfig, memexIntroConfig } from '@/config/memex/idea'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { useIdeaLike } from '../../hooks/use-idea-like'

interface Props {
  onLikeSuccess?: VoidFunction
}

const { likeUsdtFee } = memexIdeaConfig

const { likerReward } = memexIntroConfig

export const LikeDialog = ({
  open,
  onOpenChange,
  onLikeSuccess,
}: ComponentProps<typeof Dialog> & Props) => {
  const { t } = useTranslation()
  const {
    idea,
    ideaInfo,
    ideaStatus,
    chain: { native } = {},
    chainId,
    duration,
    ownerPercent,
    likeValue,
  } = useIdeaCardContext()
  const { isCreator } = ideaStatus

  const { isLiking, like } = useIdeaLike(
    chainId,
    idea?.memex_version,
    idea?.ido_address,
    onLikeSuccess
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
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
          = {likeValue} {native?.symbol}({likeUsdtFee} USDT)
        </span>
      </div>
      <div className="text-zinc-500 text-sm">
        <p>
          {isCreator
            ? utilLang.replace(t('memex.like.desc'), [ownerPercent + '%'])
            : utilLang.replace(t('memex.liker-desc'), [likerReward])}
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
          onClick={() => onOpenChange?.(false)}
        >
          {t('cancel')}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default LikeDialog
