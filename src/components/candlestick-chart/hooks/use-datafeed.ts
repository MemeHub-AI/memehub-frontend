import { isEmpty } from 'lodash'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/charting_library/charting_library'
import type { CandlestickOptions } from './use-candlestick'

import { useDatafeedConfig } from './use-datafeed-config'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-candlestick-websocket'
import { useCandlestickParse } from './use-candlestick-parse'

export const useDatafeed = () => {
  const { readyConfig, symbolInfoConfig } = useDatafeedConfig()
  const { setSub, getSub } = useDatafeedCache()
  const { listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket()
  const { parseTradingViewInterval, toBars } = useCandlestickParse()

  const createDatafeed = (options: CandlestickOptions) => {
    const { symbol, interval, tokenAddr } = options

    return {
      onReady: (callback) => setTimeout(() => callback(readyConfig)),
      searchSymbols(_, __, ___, ____) {},
      resolveSymbol(symbolName, onResolve, onError, extension) {
        const symbolInfo: LibrarySymbolInfo = {
          ...symbolInfoConfig,
          name: symbolName,
          full_name: symbolName,
          description: symbolName,
        }

        onResolve(symbolInfo)
      },
      async getBars(symbolInfo, resolution, period, onResult, onError) {
        if (period.firstDataRequest) {
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
      subscribeBars(symbolInfo, resolution, onTick, uid, onRest) {
        setSub(uid, onRest)
        onUpdate((data) => {
          console.log('update', data)
        })
      },
      unsubscribeBars(uid) {
        // unsubscribe
        getSub(uid)?.()
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
