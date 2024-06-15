import { BigNumber } from 'bignumber.js'
import { parseEther } from 'viem'

import { TRADE_SERVICE_FEE } from '@/constants/contract'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()

  return e.includes('user rejected') || e.includes('user denied')
}

// v1's `amount` is based native token.
export const addServiceFeeV1 = (amount: string) => {
  const amountBigint = parseEther(amount)
  const total = BigNumber(amountBigint.toString())
    .multipliedBy(TRADE_SERVICE_FEE)
    .toFixed(0)

  return BigInt(total)
}

// v2's `amount` is based target token.
export const addServiceFeeV2 = (amount: string) => {
  console.log('fee v2', amount)
}
