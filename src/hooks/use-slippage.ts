import { useState } from 'react'
import { BigNumber } from 'bignumber.js'

import { useLocalStorage } from '@/hooks/use-storage'
import { defaultSlippage } from '@/config/trade'

export const useSlippage = () => {
  const { getStorage, setStorage } = useLocalStorage()
  const cachedSlippage = getStorage('slippage') || defaultSlippage

  const slip = BigNumber(cachedSlippage).isNaN()
    ? defaultSlippage
    : cachedSlippage

  const [slippage, setSlip] = useState(slip)

  const setSlippage = (value: string) => {
    setSlip(value)
    setStorage('slippage', value)
  }

  return {
    slippage,
    setSlippage,
  }
}
