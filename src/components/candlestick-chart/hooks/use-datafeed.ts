import { isEmpty, last } from 'lodash'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/js/charting_library/charting_library'
import type { CandlestickOptions } from './use-candlestick'

import { useDatafeedConfig } from './use-datafeed-config'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-candlestick-websocket'
import { useCandlestickParse } from './use-candlestick-parse'

export const useDatafeed = () => {
  const { readyConfig, symbolInfoConfig } = useDatafeedConfig()
  const cache = useDatafeedCache()
  const { listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket()
  const { parseTradingViewInterval, toBars, priceToPricescale } =
    useCandlestickParse()

  const createDatafeed = (options: CandlestickOptions) => {
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
        onResolve(symbolInfo)
      },
      async getBars(symbolInfo, resolution, period, onResult, onError) {
        if (period.firstDataRequest) {
          const cachedBars = cache.getBars()
          if (cachedBars && !isEmpty(cachedBars)) {
            onResult(cachedBars, { noData: false })
            return
          }

          const { data } = await listenAsync({
            interval: parseTradingViewInterval(resolution),
            token_address: tokenAddr,
          })
          const bars = toBars(data)

          onResult(bars, { noData: isEmpty(data) })
          return
        }

        const { data } = await historyAsync({
          interval: parseTradingViewInterval(resolution),
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
          console.log('update', bars)
          bars.forEach(onTick)
        })
      },
      unsubscribeBars(uid) {
        // cache.getSub(uid)?.()
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
