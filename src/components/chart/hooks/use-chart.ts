import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../../public/js/charting_library/charting_library'
import { useDatafeed } from './use-datafeed'
import { useChartStore } from '@/stores/use-chart-store'
import { useChartUtils } from './use-chart-utils'
import { chartConfig } from '@/config/chart'

export interface ChartOptions {
  symbol: string
  interval: string
  tokenAddr: string
}

export const useChart = () => {
  const { i18n } = useTranslation()
  const [isCreating, setIsCreating] = useState(true)
  const { chart, setChart, setChartEl } = useChartStore()
  const { createDatafeed, removeDatafeed } = useDatafeed()
  const { parseInterval } = useChartUtils()

  const createChart = (container: HTMLDivElement, options: ChartOptions) => {
    const { symbol, interval } = options || {}

    setChartEl(container)
    try {
      const chart = new (widget || window.TradingView.widget)({
        ...chartConfig.options,
        container,
        symbol,
        interval: parseInterval(interval) as ResolutionString,
        datafeed: createDatafeed(),
        locale: i18n.language as LanguageCode,
        autosize: true,
        timezone: i18n.language === 'zh' ? 'Asia/Shanghai' : 'Etc/UTC',
      })

      chart.onChartReady(() => {
        setChart(chart)
        chart.applyOverrides(chartConfig.overrides)
      })
      return chart
    } catch (error) {
      console.error('[createChart Erorr]:', error)
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
    isCreating,
    createChart,
    removeChart,
  }
}
