import React, { useEffect, useRef, memo } from 'react'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import type { ClassValue } from 'class-variance-authority/types'

import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'
import { useChartStore } from '@/stores/use-chart-store'
import { useStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

export const Chart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { query } = useRouter()
  const chain = (query.chain || '') as string
  const addr = (query.address || '') as string
  const { tokenInfo } = useTokenContext()
  const { isCreating, createChart, removeChart } = useChart()
  const { getInterval } = useStorage()
  const { chart } = useChartStore()

  useEffect(() => {
    if (!chartRef.current || isEmpty(addr) || !tokenInfo) return

    createChart(chartRef.current, {
      symbol: tokenInfo.ticker,
      interval: getInterval(chain, addr) || '1m',
      tokenAddr: addr,
    })

    return removeChart
  }, [tokenInfo])

  return (
    <>
      <div
        ref={chartRef}
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
          'rounded-md overflow-hidden max-sm:mt-3',
          isCreating && 'scale-0 absolute'
        )}
      ></div>
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
