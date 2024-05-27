import React, { useEffect, useRef, memo } from 'react'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { useCandlestick } from './hooks/use-candlestick'
import { useTokenContext } from '@/contexts/token'

export const CandlestickChart = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { query } = useRouter()
  const { tokenInfo } = useTokenContext()
  const { createChart, removeChart } = useCandlestick()

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
      className="min-h-[600px] border rounded overflow-hidden"
    ></div>
  )
})

export default CandlestickChart
