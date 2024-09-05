import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import {
  widget,
  LanguageCode,
  ResolutionString,
  Timezone,
} from '../../../public/js/charting_library/charting_library'
import { useDatafeed } from './use-datafeed'
import { useChartStore } from '@/stores/use-chart-store'
import { chartOptions, chartOverrides } from '@/config/chart'
import { parseInterval } from '@/utils/chart'
import { reportException } from '@/errors'
import { DatafeedCandles } from './datafeed-types'
import { datafeedDefaultInterval } from '@/config/datafeed'
import { useLocalStorage } from '@/hooks/use-storage'

interface ChartOptions {
  symbol: string
  tokenAddr: string
  unit: keyof DatafeedCandles
}

export const useChart = () => {
  const { i18n } = useTranslation()
  const [isCreating, setIsCreating] = useState(true)
  const { chart, setChart, setChartEl } = useChartStore()
  const { isConnected, createDatafeed, removeDatafeed } = useDatafeed()
  const { getStorage } = useLocalStorage()

  const createChart = (container: HTMLDivElement, options: ChartOptions) => {
    const { symbol, unit } = options || {}
    const interval = getStorage('chart_interval') || datafeedDefaultInterval

    setChartEl(container)
    try {
      const chart = new (widget || window.TradingView.widget)({
        ...chartOptions,
        container,
        symbol,
        interval: parseInterval(interval) as ResolutionString,
        datafeed: createDatafeed(unit),
        locale: i18n.language as LanguageCode,
        autosize: true,
        timezone: dayjs.tz.guess() as Timezone,
      })

      chart.onChartReady(() => {
        setChart(chart)
        chart.applyOverrides(chartOverrides)
      })
      return chart
    } catch (e) {
      reportException(e)
    } finally {
      setIsCreating(false)
    }
  }

  const removeChart = () => {
    removeDatafeed()
    chart?.remove()
    setChart(null)
  }

  return {
    isConnected,
    isCreating,
    createChart,
    removeChart,
  }
}
