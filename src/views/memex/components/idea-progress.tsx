import { type ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'

import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { BI_ZERO } from '@/constants/number'

export const IdeaProgress = ({
  value,
  className,
  indicatorClass,
  ...props
}: ComponentProps<typeof Progress>) => {
  const { ideaInfo } = useIdeaCardContext()
  const { likeCount = BI_ZERO, maxCount = BI_ZERO } = ideaInfo ?? {}

  const percent = BigNumber(likeCount.toString())
    .div(maxCount.toString())
    .multipliedBy(100)
  const progress = percent.lte(0) || percent.isNaN() ? 0 : percent.toFixed()

  return (
    <Progress
      value={progress}
      className={cn('mt-2 h-5 rounded border border-black', className)}
      indicatorClass={cn('bg-red-500', indicatorClass)}
      {...props}
    />
  )
}

export default IdeaProgress
