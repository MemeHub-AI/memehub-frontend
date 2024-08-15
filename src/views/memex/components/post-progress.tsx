import { type ComponentProps } from 'react'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export const PostProgress = ({
  value,
  className,
  indicatorClass,
  ...props
}: ComponentProps<typeof Progress>) => {
  return (
    <Progress
      value={value}
      className={cn('mt-2 h-5 rounded border-2 border-black', className)}
      indicatorClass={cn('bg-red-500', indicatorClass)}
      {...props}
    />
  )
}

export default PostProgress
