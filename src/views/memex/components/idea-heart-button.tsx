import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface Props {
  likedCount: string
  isLiked: boolean
  onOpenLike: () => string | number | undefined
}

export const IdeaHeartButton = ({ likedCount, isLiked, onOpenLike }: Props) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="purple"
      shadow="none"
      size="sm"
      className="flex items-center space-x-1 rounded-full px-4 max-sm:px-3 shadow-lg shadow-zinc-400"
      onClick={() => {
        if (isLiked) {
          return toast.info(t('already-liked'))
        }
        return onOpenLike()
      }}
    >
      {isLiked ? (
        <div className="flex items-center space-x-1 animate-flash-no-infinite">
          <HeartFilledIcon className="w-5 h-5 text-red-500" />
          <span>{likedCount}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <HeartIcon className="w-5 h-5" />
          <span>{t('like')}</span>
          <span>{likedCount}</span>
        </div>
      )}
    </Button>
  )
}

export default IdeaHeartButton