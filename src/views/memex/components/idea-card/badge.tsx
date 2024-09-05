import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDeployIdea } from '../../create/hooks/use-deploy-idea'

export const IdeaCardBadge = () => {
  const { t } = useTranslation()
  const { idea, ideaStatus, isDetails, isNonPay, refetchInfo } =
    useIdeaCardContext()
  const { isSuccess, isFailed } = ideaStatus

  const { isDeploying, deploy } = useDeployIdea(idea?.chain, refetchInfo)

  if (isSuccess) {
    return (
      <Badge
        className={cn(
          // 'absolute top-4 right-2 px-0.5 bg-purple-600 hover:bg-purple-600',
          'px-1 bg-green-600/80 hover:bg-green-600/60 text-sm font-medium',
          isDetails && 'top-0 right-3'
        )}
      >
        🚀 {t('memex.successed')}
      </Badge>
    )
  }

  if (isNonPay) {
    return (
      // <div className="absolute top-3 right-3 text-right">
      <div className="text-right">
        <Button
          type="button"
          variant="yellow"
          shadow="none"
          size="xs"
          disabled={isDeploying}
          onClick={(e) => {
            e.stopPropagation()
            if (!idea) return
            deploy({
              projectId: idea?.hash,
              tokenId: null,
              name: idea?.name,
              symbol: idea?.symbol,
              marketing: [],
              initialBuyAmount: '',
            }).catch(() => {})
          }}
        >
          {t('memex.recreate')}
        </Button>
        <p className="text-xs sm:text-sm text-yellow-600">
          {t('memex.publsih-failed')}
        </p>
      </div>
    )
  }

  if (isFailed) {
    return (
      <Badge
        className={cn(
          // 'absolute top-4 right-2 px-0.5 bg-purple-600 hover:bg-purple-600',
          'px-1 bg-yellow-300/80 hover:bg-yellow-300/60 text-sm font-medium text-black',
          isDetails && 'top-0 right-3'
        )}
      >
        😅 {t('fail')}
      </Badge>
    )
  }
}

export default IdeaCardBadge
