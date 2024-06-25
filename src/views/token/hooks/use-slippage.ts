import { useState } from 'react'
import { BigNumber } from 'bignumber.js'

import { useStorage } from '@/hooks/use-storage'

const DEFAULT_SLIPPAGE = '5'

export const useSlippage = () => {
  const { getSlippage, setSlippage: setCacheSlippage } = useStorage()
  const cachedSlippage = getSlippage() || DEFAULT_SLIPPAGE
  const slip = BigNumber(cachedSlippage).isNaN()
    ? DEFAULT_SLIPPAGE
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
