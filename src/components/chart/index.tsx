import React, { useEffect, useRef, memo } from 'react'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'

export const Chart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { query } = useRouter()
  const { tokenInfo } = useTokenContext()
  const { createChart, removeChart } = useChart()

  useEffect(() => {
    const tokenAddr = (query.address || '') as string
    if (!chartRef.current || !tokenInfo || isEmpty(tokenAddr)) {
      return
    }

    createChart(chartRef.current, {
      symbol: tokenInfo.ticker,
      interval: '1m',
      tokenAddr,
    })

    return removeChart
  }, [query, tokenInfo])

  return (
    <div
      ref={chartRef}
      className="min-h-[560px] border rounded overflow-hidden"
    ></div>
  )
})

export default Chart
