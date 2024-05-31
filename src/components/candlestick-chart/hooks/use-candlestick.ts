import { useTranslation } from 'react-i18next'
import {
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../../public/js/charting_library/charting_library'
import { useDatafeed } from './use-datafeed'
import { useCandlestickStore } from '@/stores/use-candlestick-store'
import { useCandlestickParse } from './use-candlestick-parse'
import { useCandlestickConfig } from './use-candlestick-config'

export interface CandlestickOptions {
  symbol: string
  interval: string
  tokenAddr: string
}

export const useCandlestick = () => {
  const { i18n } = useTranslation()
  const { chart, setChart } = useCandlestickStore()
  const { createDatafeed, removeDatafeed } = useDatafeed()
  const { toTradingViewInterval } = useCandlestickParse()
  const { chartConfig } = useCandlestickConfig()

  const createChart = (
    container: HTMLDivElement,
    options: CandlestickOptions
  ) => {
    const { symbol, interval } = options || {}

    // setChartEl(container) // Error: Maximum update depth exceeded
    try {
      const chart = new (widget || window.TradingView.widget)({
        ...chartConfig,
        container,
        symbol,
        interval: toTradingViewInterval(interval) as ResolutionString,
        datafeed: createDatafeed(options),
        locale: i18n.language as LanguageCode,
        autosize: true,
        timezone: 'Etc/UTC',
      })

      chart.onChartReady(() => setChart(chart))
    } catch (error) {
      console.error('[createChart Erorr]:', error)
    }
  }

  const removeChart = () => {
    console.log('remove')
    removeDatafeed()
    chart?.remove()
  }

  return {
    createChart,
    removeChart,
  }
}
