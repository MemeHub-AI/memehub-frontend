import React, { useEffect, useRef, memo, useState } from 'react'
import { isEmpty } from 'lodash'

import type { ClassValue } from 'class-variance-authority/types'
import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'
import { useStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { isListed } from '@/utils/token'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { DexToolsChart } from '../dextools-chart'

enum ChartType {
  Memehub,
  Dex,
}

export const Chart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { tokenInfo } = useTokenContext()
  const { isCreating, createChart, removeChart } = useChart()
  const { getInterval } = useStorage()
  const [tab, setTab] = useState(ChartType.Memehub)

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
      {/* <Tabs
        value={tab.toString()}
        onValueChange={(v) => setTab(v as unknown as ChartType)}
      >
        <TabsList>
          <TabsTrigger value={ChartType.Memehub.toString()}>
            memehub chart
          </TabsTrigger>
        </TabsList>
        <TabsList>
          <TabsTrigger value={ChartType.Dex.toString()}>dex chart</TabsTrigger>
        </TabsList>
        <div
          className={cn(
            'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
            'rounded-md overflow-hidden max-sm:mt-3',
            isCreating && 'scale-0 absolute'
          )}
        >
          <TabsContent value={ChartType.Memehub.toString()}>
            <div ref={chartRef}></div>
          </TabsContent>
          <TabsContent value={ChartType.Dex.toString()}>
            <DexToolsChart />
          </TabsContent>
        </div>
      </Tabs> */}
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
