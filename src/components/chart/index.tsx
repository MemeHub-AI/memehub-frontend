import React, { useEffect, useRef, memo, useState } from 'react'
import { isEmpty } from 'lodash'

import type { ClassValue } from 'class-variance-authority/types'
import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'
import { useStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { DexToolsChart } from '../dextools-chart'
import { usePools } from '@/views/token/hooks/use-pools'
import { datafeedConfig } from '@/config/datafeed'
import { Button } from '../ui/button'
import { useChartUtils } from './hooks/use-chart-utils'
import { useChartStore } from '@/stores/use-chart-store'

export const Chart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { tokenInfo } = useTokenContext()
  const { isCreating, createChart, removeChart } = useChart()
  const { getInterval } = useStorage()
  const { isGrauated } = usePools(tokenInfo?.address)
  const { formatInterval } = useChartUtils()
  const { chart } = useChartStore()
  const [, update] = useState(false)
  const activeChart = chart?.activeChart()

  useEffect(() => {
    if (!chartRef.current || isEmpty(tokenAddr) || !tokenInfo) return

    createChart(chartRef.current, {
      symbol: tokenInfo.ticker,
      interval: getInterval(chainName, tokenAddr) || '1m',
      tokenAddr,
    })

    return removeChart
  }, [tokenInfo])

  return (
    <>
      <div
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
          'rounded-md overflow-hidden max-sm:mt-3',
          isCreating && 'scale-0 absolute'
        )}
      >
        {isGrauated ? (
          <DexToolsChart className="w-full h-full" />
        ) : (
          <>
            {datafeedConfig.readyConfig.supported_resolutions?.map((r) => (
              <Button
                key={r}
                size="sm"
                shadow="none"
                variant="ghost"
                className={cn(
                  activeChart?.resolution() === r && 'text-blue-600'
                )}
                onClick={() => {
                  activeChart?.setResolution(r)
                  // Refresh component, because `setResolution` does not refresh
                  update((v) => !v)
                }}
              >
                {formatInterval(r, false)}
              </Button>
            ))}
            <hr />
            <div ref={chartRef} className="w-full h-full"></div>
          </>
        )}
      </div>

      <ChartSkeleton className={!isCreating && 'scale-0 absolute'} />
    </>
  )
})

const ChartSkeleton = ({ className }: { className: ClassValue }) => (
  <div
    className={cn(
      'min-h-[415px] border-2 border-black rounded-md',
      'overflow-hidden max-sm:mt-3 max-sm:h-[20vh] py-2',
      'flex flex-col',
      className
    )}
  >
    <Skeleton className="w-10 h-6 mx-2" />
    <hr className="my-2" />
    <div className="flex justify-between px-2 mb-2 flex-1">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-48 h-4" />
        </div>
        <Skeleton className="w-28 h-4" />
      </div>
      <div className="flex flex-col justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton className="w-24 h-4" key={i} />
        ))}
      </div>
    </div>
    <div className="flex items-center justify-between px-2 pt-2 border-t">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="w-10 h-4" key={i} />
      ))}
    </div>
  </div>
)

export default Chart
