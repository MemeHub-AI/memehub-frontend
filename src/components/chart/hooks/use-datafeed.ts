import { isEmpty, last } from 'lodash'
import { useRouter } from 'next/router'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/js/charting_library/charting_library'

import { useDatafeedConfig } from './use-datafeed-config'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-datafeed-websocket'
import { useChartUtils } from './use-chart-utils'
import { useStorage } from '@/hooks/use-storage'

export const useDatafeed = () => {
  const { query } = useRouter()
  const chain = (query.chain || '') as string
  const addr = (query.address || '') as string

  const { getInterval, setInterval } = useStorage()
  const interval = getInterval(chain, addr) || '1m'
  const { readyConfig, symbolInfoConfig } = useDatafeedConfig()
  const cache = useDatafeedCache()
  const { listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket({
      onReconnect: () => listenAsync({ interval, token_address: addr }),
    })
  const { formatInterval, formatBars, formatPricescale } = useChartUtils()

  const createDatafeed = () => {
    return {
      onReady: (callback) => setTimeout(() => callback(readyConfig)),
      searchSymbols(_, __, ___, ____) {},
      async resolveSymbol(symbolName, onResolve, onError, extension) {
        const { data } = await listenAsync({
          interval,
          token_address: addr,
        })
        const bars = formatBars(data)
        const lastBar = last(bars)
        const symbolInfo: LibrarySymbolInfo = {
          ...symbolInfoConfig,
          name: symbolName,
          full_name: symbolName,
          description: symbolName,
          pricescale: formatPricescale(lastBar?.open),
          // pricescale: 100,
          // minmov: 1,
        }

        console.log('pricescale', symbolInfo.pricescale)
        cache.setBars(bars)
        cache.setLastBar(lastBar)
        onResolve(symbolInfo)
      },
      async getBars(symbolInfo, resolution, period, onResult, onError) {
        const interval = formatInterval(resolution)

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
            token_address: addr,
          })
          const bars = formatBars(data)
          !isEmpty(bars) && cache.setLastBar(last(bars))
          setInterval(chain, addr, interval)
          onResult(bars, { noData: isEmpty(data) })
          return
        }

        const { data } = await historyAsync({
          interval,
          token_address: addr,
          start: period.from,
          limit: period.countBack,
        })
        const bars = formatBars(data)

        !isEmpty(bars) && cache.setLastBar(last(bars))
        onResult(bars, { noData: isEmpty(bars) })
      },
      subscribeBars(_, resolution, onTick, uid, onRest) {
        console.log('subscribe', uid)
        onUpdate(({ data }) => {
          const bars = formatBars(data)

          bars.forEach((bar) => {
            const lastTime = cache.getLastBar()?.time || 0
            if (bar.time < lastTime) return

            onTick(bar)
            cache.setLastBar(bar)
          })
        })
      },
      unsubscribeBars(uid) {
        console.log('unsubscribe', uid)
      },
    } as IBasicDataFeed
  }

  const removeDatafeed = () => {
    console.log('remove datafeed')
    disconenct()
  }

  return {
    createDatafeed,
    removeDatafeed,
  }
}
