import { type ComponentProps } from 'react'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import ProgressBar from 'react-bootstrap/ProgressBar'

export const IdeaProgress = ({
  value,
  className,
  isSuccess,
  isFailed,
}: {
  value: number
  className?: string
  isSuccess?: boolean
  isFailed?: boolean
}) => {
  const getProcessState = () => {
    if (value === 100 && isSuccess) {
      return undefined
    }

    if (isFailed) return 'warning'

    return 'danger'
  }

  return (
    // <Progress
    //   value={value}
    //   className={cn('mt-2 h-5 rounded border-2 border-black', className)}
    //   indicatorClass={cn('bg-red-500', indicatorClass)}
    //   {...props}
    // />
    <ProgressBar
      animated={getProcessState() === 'danger'}
      // animated
      variant={getProcessState()}
      label={value > 10 && `${value}%`}
      now={value}
      className={cn('mt-2', className)}
    />
  )
}

export default IdeaProgress
