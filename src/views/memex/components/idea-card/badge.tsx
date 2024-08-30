import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { cn } from '@/lib/utils'

export const IdeaCardBadge = () => {
  const { t } = useTranslation()
  const { ideaStatus, isDetails } = useIdeaCardContext()
  const { isSuccess, isFailed } = ideaStatus

  if (isSuccess) {
    return (
      <Badge
        className={cn(
          'absolute top-4 right-2 px-0.5 bg-purple-600 hover:bg-purple-600',
          isDetails && 'top-0 right-3'
        )}
      >
        🚀 {t('memex.successed')}
      </Badge>
    )
  }

  if (isFailed) {
    return (
      <p className="absolute top-2 right-3 font-bold text-zinc-400">
        {t('fail').toUpperCase()}
      </p>
    )
  }
}

export default IdeaCardBadge
