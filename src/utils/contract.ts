import { BigNumber } from 'bignumber.js'
import { parseEther } from 'viem'

import { SERVICE_FEE } from '@/config/trade'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()

  return e.includes('user rejected') || e.includes('user denied')
}

// Add service fee when trade.
export const addServiceFee = (amount: string) => {
  // total = amount + (amount * SERVICE_FEE)
  const total = BigNumber(amount).multipliedBy(SERVICE_FEE).plus(amount)
  return parseEther(total.toFixed())
}
