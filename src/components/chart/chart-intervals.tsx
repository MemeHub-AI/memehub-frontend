import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { datafeedResolutions, datafeedResolutionsMap } from '@/config/datafeed'
import { cn } from '@/lib/utils'
import { useChartStore } from '@/stores/use-chart-store'

export const ChartIntervals = () => {
  const [, update] = useState(false)
  const { chart } = useChartStore()
  const activeChart = chart?.activeChart()

  return (
    <div className="flex items-center">
      {datafeedResolutions.map((r) => (
        <Button
          key={r}
          size="sm"
          shadow="none"
          variant="ghost"
          className={cn(
            activeChart?.resolution().toLowerCase() === r && 'text-blue-600'
          )}
          onClick={() => {
            activeChart?.setResolution(r)
            update((v) => !v)
          }}
        >
          {datafeedResolutionsMap[r]}
        </Button>
      ))}
    </div>
  )
}

export default ChartIntervals
