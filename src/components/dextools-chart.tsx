import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { dexChainMap, dexChartBaseUrl, DexChain } from '@/config/dex-chart'
import { resources } from '@/i18n'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { qs } from '@/hooks/use-fetch'

export const DexToolsChart = () => {
  const { i18n } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()

  // See: https://github.com/dextools-io/chart-widget
  const url = useMemo(() => {
    const code = resources[i18n.language].iso31661
    const chain = dexChainMap[chainName as DexChain]
    const query = qs.stringify({
      theme: 'light',
      chartType: '1',
      chartResolution: '30',
      drawingToolbars: false,
    })

    return `${dexChartBaseUrl}/${code}/${chain}/pe-light/${tokenAddr}${query}`
  }, [i18n, chainName, tokenAddr])

  console.log('url', url)

  return (
    <>
      <iframe
        // src={url}
        src="https://www.dextools.io/widget-chart/en/bnb/pe-light/0x4ad2a00859d42ba4a9783ee5dd1832d33b7db407?theme=light&chartType=1&chartResolution=30&drawingToolbars=false"
        id="dextools-widget"
        title="DEXTools Trading Chart"
        width="500"
        height="400"
      ></iframe>
    </>
  )
}

export default DexToolsChart
