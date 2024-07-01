import React, { ComponentProps, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { dexChainMap, dexChartBaseUrl, DexChain } from '@/config/dex-chart'
import { resources } from '@/i18n'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { qs } from '@/hooks/use-fetch'

export const DexToolsChart = ({
  className,
  ...props
}: ComponentProps<'iframe'>) => {
  const { i18n } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()

  // See: https://github.com/dextools-io/chart-widget
  const src = useMemo(() => {
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

  console.log('dex chart src', src)

  return (
    <>
      <iframe
        src={src}
        id="dextools-widget"
        title="DEXTools Trading Chart"
        className={className}
        {...props}
      ></iframe>
    </>
  )
}

export default DexToolsChart
