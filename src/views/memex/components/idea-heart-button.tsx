import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

interface Props {
  likedCount: string
  isLiked: boolean
  onClick: () => string | number | undefined
}

export const IdeaHeartButton = ({ likedCount, isLiked, onClick }: Props) => {
  return (
    <Button
      variant="red"
      shadow="none"
      size="sm"
      className="flex items-center space-x-1 rounded-full px-3.5 shadow-lg shadow-zinc-400"
      onClick={onClick}
    >
      <div className="flex items-center space-x-0.5 text-sm">
        {isLiked ? (
          <HeartFilledIcon className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
        ) : (
          <HeartIcon className="w-5 h-5" />
        )}
        <span>{likedCount}</span>
      </div>
    </Button>
  )
}

export default IdeaHeartButton
