import { isEmpty, last } from 'lodash'
import { useRouter } from 'next/router'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/js/charting_library/charting_library'
import type { ChartOptions } from './use-chart'

import { useDatafeedConfig } from './use-datafeed-config'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-datafeed-websocket'
import { useChartParse } from './use-chart-parse'
import { useStorage } from '@/hooks/use-storage'

export const useDatafeed = () => {
  const { readyConfig, symbolInfoConfig } = useDatafeedConfig()
  const cache = useDatafeedCache()
  const { listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket()
  const { parseTVInterval, toBars, priceToPricescale } = useChartParse()
  const { query } = useRouter()
  const chain = (query.chain || '') as string
  const addr = (query.address || '') as string
  const { getInterval, setInterval } = useStorage()

  const createDatafeed = (options: ChartOptions) => {
    const { symbol, interval, tokenAddr } = options

    return {
      onReady: (callback) => setTimeout(() => callback(readyConfig)),
      searchSymbols(_, __, ___, ____) {},
      async resolveSymbol(symbolName, onResolve, onError, extension) {
        const { data } = await listenAsync({
          interval,
          token_address: tokenAddr,
        })
        const bars = toBars(data)
        const symbolInfo: LibrarySymbolInfo = {
          ...symbolInfoConfig,
          name: symbolName,
          full_name: symbolName,
          description: symbolName,
          pricescale: priceToPricescale(Number(last(bars)?.open)),
        }

        cache.setBars(bars)
        cache.setLatBar(last(bars))
        onResolve(symbolInfo)
      },
      async getBars(symbolInfo, resolution, period, onResult, onError) {
        const interval = parseTVInterval(resolution)

        if (period.firstDataRequest) {
          const cachedBars = cache.getBars() || []
          const cachedInterval = getInterval(chain, addr)
          // Have cached bars & interval no change, use cache.
          if (!isEmpty(cachedBars) && cachedInterval === interval) {
            onResult(cachedBars, { noData: false })
            return
          }

          const { data } = await listenAsync({
            interval,
            token_address: tokenAddr,
          })
          const bars = toBars(data)

          setInterval(chain, addr, interval)
          onResult(bars, { noData: isEmpty(data) })
          return
        }

        const { data } = await historyAsync({
          interval,
          token_address: tokenAddr,
          start: period.from,
          limit: period.countBack,
        })
        const bars = toBars(data)

        onResult(bars, { noData: isEmpty(bars) })
      },
      subscribeBars(_, resolution, onTick, uid, onRest) {
        // cache.setSub(uid, onRest)
        onUpdate(({ data }) => {
          const bars = toBars(data)
          const latestTime = last(bars)?.time || 0
          const lastTime = cache.getLastBar()?.time || 0

          console.log(
            'Chart update:',
            '\n',
            `latest time: ${latestTime}`,
            '\n',
            `last time: ${lastTime}`
          )

          if (latestTime < lastTime) return
          bars.forEach(onTick)
        })
      },
      unsubscribeBars(uid) {
        cache.getSub(uid)?.()
      },
    } as IBasicDataFeed
  }

  const removeDatafeed = () => {
    disconenct()
  }

  return {
    createDatafeed,
    removeDatafeed,
  }
}
