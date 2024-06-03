import { useTranslation } from 'react-i18next'
import {
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../../public/js/charting_library/charting_library'
import { useDatafeed } from './use-datafeed'
import { useChartStore } from '@/stores/use-chart-store'
import { useChartParse } from './use-chart-parse'
import { useChartConfig } from './use-chart-config'

export interface ChartOptions {
  symbol: string
  interval: string
  tokenAddr: string
}

export const useChart = () => {
  const { i18n } = useTranslation()
  const { chart, setChart } = useChartStore()
  const { createDatafeed, removeDatafeed } = useDatafeed()
  const { toTVInterval } = useChartParse()
  const { chartConfig, chartOverrides } = useChartConfig()

  const createChart = (container: HTMLDivElement, options: ChartOptions) => {
    const { symbol, interval } = options || {}

    // setChartEl(container) // Error: Maximum update depth exceeded
    try {
      const chart = new (widget || window.TradingView.widget)({
        ...chartConfig,
        container,
        symbol,
        interval: toTVInterval(interval) as ResolutionString,
        datafeed: createDatafeed(options),
        locale: i18n.language as LanguageCode,
        autosize: true,
        timezone: i18n.language === 'zh' ? 'Asia/Shanghai' : 'Etc/UTC',
      })

      chart.onChartReady(() => {
        setChart(chart)
        chart.applyOverrides(chartOverrides)
      })
    } catch (error) {
      console.error('[createChart Erorr]:', error)
    }
  }

  const removeChart = () => {
    removeDatafeed()
    chart?.remove()
  }

  return {
    createChart,
    removeChart,
  }
}
