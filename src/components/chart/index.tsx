import React, { useEffect, useRef, memo } from 'react'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'
import { useChartStore } from '@/stores/use-chart-store'
import { useStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'

export const Chart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { query } = useRouter()
  const chain = (query.chain || '') as string
  const addr = (query.address || '') as string
  const { tokenInfo } = useTokenContext()
  const { createChart, removeChart } = useChart()
  const { getInterval } = useStorage()
  const { chart } = useChartStore()

  useEffect(() => {
    const tokenAddr = (query.address || '') as string
    if (!chartRef.current || !tokenInfo || isEmpty(tokenAddr)) {
      return
    }

    createChart(chartRef.current, {
      symbol: tokenInfo.ticker,
      interval: getInterval(chain, addr) || '1m',
      tokenAddr,
    })

    return removeChart
  }, [query, tokenInfo])

  return (
    <div
      ref={chartRef}
      className={cn(
        'min-h-[560px] border-2 border-black rounded-md',
        'overflow-hidden max-sm:mt-3 max-sm:h-[60vh]'
      )}
    ></div>
  )
})

export default Chart
