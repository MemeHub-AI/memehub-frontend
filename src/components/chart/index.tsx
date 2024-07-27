import React, { useEffect, useRef, memo, useState } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { useChart } from './hooks/use-chart'
import { useTokenContext } from '@/contexts/token'
import { useStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { ChartDexScreener } from '../chart-dexscrenner'
import { usePools } from '@/views/token/hooks/use-pools'
import { datafeedConfig } from '@/config/datafeed'
import { Button } from '../ui/button'
import { useChartStore } from '@/stores/use-chart-store'
import { formatInterval } from '@/utils/chart'
import { CustomSuspense } from '../custom-suspense'

export const Chart = memo(() => {
  const { t } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { tokenInfo, isNotFound, isIdoToken } = useTokenContext()
  const { isCreating, createChart, removeChart } = useChart()
  const { getInterval } = useStorage()
  const { isGraduated } = usePools(tokenInfo?.address)
  const { chart } = useChartStore()
  const [, update] = useState(false)
  const activeChart = chart?.activeChart()

  useEffect(() => {
    if (
      !chartRef.current ||
      isEmpty(tokenAddr) ||
      !tokenInfo ||
      isNotFound ||
      isIdoToken
    ) {
      return
    }

    createChart(chartRef.current, {
      symbol: tokenInfo.ticker,
      interval: getInterval(chainName, tokenAddr) || '1m',
      tokenAddr,
    })

    return removeChart
  }, [tokenInfo])

  // TODO: ido temp
  if (isNotFound && !isIdoToken) {
    return (
      <div
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
          'rounded-md overflow-hidden max-sm:mt-3 flex justify-center items-center'
        )}
      >
        <p className="font-bold">{t('token.not-found-desc')}</p>
      </div>
    )
  }

  return (
    <>
      <CustomSuspense
        isPending={isCreating && !isGraduated && !isIdoToken}
        fallback={<ChartSkeleton />}
        className={cn(
          'min-h-[415px] max-sm:h-[20vh] border-2 border-black',
          'rounded-md overflow-hidden max-sm:mt-3'
        )}
      >
        {isGraduated || isIdoToken ? (
          <ChartDexScreener className="w-full h-full" />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center">
              {datafeedConfig.supported_resolutions?.map((r) => (
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
            </div>
            <hr />
            <div ref={chartRef} className="w-full h-full flex-1"></div>
          </div>
        )}
      </CustomSuspense>
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
