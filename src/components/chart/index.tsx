import { useEffect, useRef, memo, useState } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { useChart } from '../../hooks/chart/use-chart'
import { useTokenContext } from '@/contexts/token'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { ChartDexScreener } from '../chart-dexscrenner'
import { ChartIntervals } from './chart-intervals'
import { ChartUnitButton } from './chart-unit-button'
import { DatafeedCandles } from '../../hooks/chart/datafeed-types'

export const Chart = memo(() => {
  const { t } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)
  const { tokenInfo, isNotFound, isIdoToken, isGraduated, tokenAddr } =
    useTokenContext()
  const { isConnected, isCreating, createChart, removeChart } = useChart()
  const [unit, setUnit] = useState<keyof DatafeedCandles>('master')

  useEffect(() => {
    if (
      !chartRef.current ||
      isEmpty(tokenAddr) ||
      !tokenInfo ||
      isNotFound ||
      isIdoToken ||
      !isConnected
    ) {
      return
    }

    createChart(chartRef.current, {
      symbol: tokenInfo.symbol,
      tokenAddr,
      unit: unit,
    })

    return removeChart
  }, [tokenInfo, isConnected, unit])

  if (isNotFound && !isIdoToken) {
    return (
      <div
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black rounded-md',
          'overflow-hidden max-sm:mt-3 flex justify-center items-center text-center'
        )}
      >
        <p className="font-bold">{t('token.not-found-desc')}</p>
      </div>
    )
  }

  return (
    <>
      <ChartUnitButton
        className="block sm:hidden w-full text-end pr-0.5"
        activeUnit={unit}
        onClick={setUnit}
      />
      <div
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
          'rounded-md overflow-hidden'
        )}
      >
        {isCreating && !isGraduated && !isIdoToken && <ChartSkeleton />}
        {isGraduated || isIdoToken ? (
          <ChartDexScreener className="w-full h-full" />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between">
              <ChartIntervals />
              <ChartUnitButton
                className="hidden sm:block"
                activeUnit={unit}
                onClick={setUnit}
              />
            </div>
            <hr />
            <div ref={chartRef} className="w-full h-full flex-1"></div>
          </div>
        )}
      </div>
    </>
  )
})

const ChartSkeleton = () => (
  <div className="flex flex-col h-full py-2">
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
