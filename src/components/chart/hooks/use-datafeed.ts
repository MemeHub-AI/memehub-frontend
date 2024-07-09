import { isEmpty, last } from 'lodash'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../../public/js/charting_library/charting_library'
import { DatafeedBaseData } from './use-datafeed-websocket/types'
import { useDatafeedCache } from './use-datafeed-cache'
import { useDatafeedWebsocket } from './use-datafeed-websocket'
import { useStorage } from '@/hooks/use-storage'
import { datafeedConfig } from '@/config/datafeed'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { formatInterval, parsePricescale } from '@/utils/chart'

const unit: keyof DatafeedBaseData = 'usd'

export const useDatafeed = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { getInterval, setInterval } = useStorage()
  const interval = getInterval(chainName, tokenAddr) || '1m'
  const cache = useDatafeedCache()
  const { emitter, listenAsync, historyAsync, onUpdate, disconenct } =
    useDatafeedWebsocket({
      onReconnect: () =>
        listenAsync({
          interval,
          token_address: tokenAddr,
          chain: chainName,
        }),
    })

  const createDatafeed = () => {
    return {
      onReady: (callback) => {
        setTimeout(() => callback(datafeedConfig.readyConfig))
        emitter.on('connect_invalid', disconenct)
      },
      searchSymbols(_, __, ___, ____) {},
      async resolveSymbol(symbolName, onResolve, onError, extension) {
        const { data } = await listenAsync({
          interval,
          token_address: tokenAddr,
          chain: chainName,
        })
        const bars = data[unit]
        const lastBar = last(bars)
        const symbolInfo: LibrarySymbolInfo = {
          ...datafeedConfig.symbolInfo,
          name: symbolName,
          full_name: `${symbolName}/USD`,
          description: `${symbolName}/USD`,
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
            token_address: tokenAddr,
            chain: chainName,
          })
          const bars = data[unit]
          !isEmpty(bars) && cache.setLastBar(last(bars))
          setInterval(chainName, tokenAddr, interval)
          onResult(bars, { noData: isEmpty(data) })
          return
        }

        const { data } = await historyAsync({
          interval,
          token_address: tokenAddr,
          start: period.from,
          limit: period.countBack,
          chain: chainName,
        })
        const bars = data[unit]

        !isEmpty(bars) && cache.setLastBar(last(bars))
        onResult(bars, { noData: isEmpty(bars) })
      },
      subscribeBars(_, resolution, onTick, uid, onRest) {
        console.log('subscribe', uid)
        onUpdate(({ data }) => {
          data[unit].forEach((bar) => {
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
    disconenct()
  }

  return {
    createDatafeed,
    removeDatafeed,
  }
}
