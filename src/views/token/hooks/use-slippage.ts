import { useState } from 'react'
import { BigNumber } from 'bignumber.js'

import { useStorage } from '@/hooks/use-storage'

const MIN_SLIPPAGE = '0'

export const useSlippage = () => {
  const { getSlippage, setSlippage: setCacheSlippage } = useStorage()
  const cachedSlippage = getSlippage() || MIN_SLIPPAGE
  const slip = BigNumber(cachedSlippage).isNaN() ? MIN_SLIPPAGE : cachedSlippage

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
