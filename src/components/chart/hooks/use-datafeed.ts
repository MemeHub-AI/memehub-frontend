import { isEmpty, last } from 'lodash'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/js/charting_library/charting_library'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-datafeed-websocket'
import { useStorage } from '@/hooks/use-storage'
import {
  datafeedConfig,
  datafeedUnit,
  symbolInfoConfig,
} from '@/config/datafeed'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { formatInterval, parsePricescale } from '@/utils/chart'
import { withPair } from '@/utils/datafeed'

// TODO: should refactor it
export const useDatafeed = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { getInterval, setInterval } = useStorage()
  const interval = getInterval(chainName, tokenAddr) || '1m'
  const cache = useDatafeedCache()
  const { ws, listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket({
      onReconnect: () =>
        listenAsync({
          interval,
          token: tokenAddr,
          chain: chainName,
        }),
    })

  const createDatafeed = () => {
    return {
      onReady: (callback) => {
        setTimeout(() => callback(datafeedConfig))
        ws.on('connect_invalid', disconenct)
      },
      searchSymbols(_, __, ___, ____) {},
      async resolveSymbol(symbolName, onResolve, onError, extension) {
        const { data } = await listenAsync({
          interval,
          token: tokenAddr,
          chain: chainName,
        })
        const bars = data[datafeedUnit]
        const lastBar = last(bars)
        const symbolInfo: LibrarySymbolInfo = {
          ...symbolInfoConfig,
          name: symbolName,
          full_name: withPair(symbolName),
          description: withPair(symbolName),
          pricescale: parsePricescale(lastBar?.open),
        }

        cache.setBars(bars)
        cache.setLastBar(lastBar)
        onResolve(symbolInfo)
      },
      async getBars(symbolInfo, resolution, period, onResult, onError) {
        const interval = formatInterval(resolution)

        if (period.firstDataRequest) {
          const cachedBars = cache.getBars() || []
          const cachedInterval = getInterval(chainName, tokenAddr)

          // Have cached bars & interval no change, use cache.
          if (!isEmpty(cachedBars) && cachedInterval === interval) {
            onResult(cachedBars, { noData: false })
            return
          }

          const { data } = await listenAsync({
            interval,
            token: tokenAddr,
            chain: chainName,
          })
          const bars = data[datafeedUnit]
          !isEmpty(bars) && cache.setLastBar(last(bars))
          setInterval(chainName, tokenAddr, interval)
          onResult(bars, { noData: isEmpty(data) })
          return
        }

        const { data } = await historyAsync({
          start: period.from,
          end: period.to,
        })
        const bars = data[datafeedUnit]

        !isEmpty(bars) && cache.setLastBar(last(bars))
        onResult(bars, { noData: isEmpty(bars) })
      },
      subscribeBars(_, resolution, onTick, uid, onRest) {
        onUpdate((data) => {
          data.data[datafeedUnit].forEach((bar) => {
            const lastTime = cache.getLastBar()?.time || 0
            if (bar.time < lastTime) return

            onTick(bar)
            cache.setLastBar(bar)
          })
        })
      },
      unsubscribeBars(uid) {},
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
