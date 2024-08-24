import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
// import ProgressBar from 'react-native-progress/Bar'
import { Progress } from '@/components/ui/progress'

export const IdeaProgress = ({
  value,
  className,
  indicatorClass,
  ...props
}: ComponentProps<typeof Progress>) => {
  // const getProcessState = () => {
  //   if (value === 100 && isSuccess) {
  //     return undefined
  //   }

  //   if (isFailed) return 'warning'

  //   return 'danger'
  // }

  return (
    <Progress
      value={value}
      className={cn('mt-2 h-5 rounded border-2 border-black', className)}
      indicatorClass={cn('bg-red-500', indicatorClass)}
      {...props}
    />
    // <ProgressBar progress={0.3} width={200} />
    // <div className="progress progress-striped active">
    //   <div
    //     role="progressbar"
    //     style={{ width: '40%' }}
    //     className="progress-bar progress-bar-danger"
    //   >
    //     <span>Danger</span>
    //   </div>
    // </div>
  )
}

export default IdeaProgress
