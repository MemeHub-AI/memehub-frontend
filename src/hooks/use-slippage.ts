import { useState } from 'react'
import { BigNumber } from 'bignumber.js'

import { useStorage } from '@/hooks/use-storage'
import { defaultSlippage } from '@/config/trade'

export const useSlippage = () => {
  const { getSlippage, setSlippage: setCacheSlippage } = useStorage()
  const cachedSlippage = getSlippage() || defaultSlippage
  const slip = BigNumber(cachedSlippage).isNaN()
    ? defaultSlippage
    : cachedSlippage

  const [slippage, setSlip] = useState(slip)

  const setSlippage = (value: string) => {
    setSlip(value)
    setCacheSlippage(value)
  }

  return {
    slippage,
    setSlippage,
  }
}
