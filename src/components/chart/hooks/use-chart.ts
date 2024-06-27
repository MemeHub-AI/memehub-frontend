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
import { useChartConfig } from './use-chart-config'
import { last } from 'lodash'
import BigNumber from 'bignumber.js'

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
  const { chartConfig, chartOverrides } = useChartConfig()

  const createChart = (container: HTMLDivElement, options: ChartOptions) => {
    const { symbol, interval } = options || {}

    setChartEl(container)
    try {
      const chart = new (widget || window.TradingView.widget)({
        ...chartConfig,
        container,
        symbol,
        interval: parseInterval(interval) as ResolutionString,
        datafeed: createDatafeed(),
        locale: i18n.language as LanguageCode,
        autosize: true,
        timezone: i18n.language === 'zh' ? 'Asia/Shanghai' : 'Etc/UTC',
      })

      chart.onChartReady(async () => {
        setChart(chart)
        chart.applyOverrides(chartOverrides)

        const { data } = await chart.activeChart().exportData()
        const price = BigNumber(last(data)?.[1] ?? 0)
          .div(2)
          .toNumber()

        chart.activeChart().setPriceToBarRatio(price)
      })
    } catch (error) {
      console.error('[createChart Erorr]:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const removeChart = () => {
    removeDatafeed()
    chart?.remove()
  }

  return {
    isCreating,
    createChart,
    removeChart,
  }
}
