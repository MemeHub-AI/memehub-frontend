import { BigNumber } from 'bignumber.js'
import { parseEther } from 'viem'

import { TRADE_SERVICE_FEE } from '@/constants/contract'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()

  return e.includes('user rejected') || e.includes('user denied')
}

/**
 * @example
 * ```
 * addServiceFee('1')
 * // 1010000000000000000n = 1.01
 * ```
 */
export const addServiceFee = (amount: string) => {
  const biAmount = parseEther(amount)
  const total = BigNumber(biAmount.toString())
    .multipliedBy(TRADE_SERVICE_FEE)
    .toFixed(0)

  return BigInt(total)
}

/**
 * Add slippage to value.
 * @example
 * ```
 * addSlippage('1', '5')
 * // 1010000000000000000n = 1.05
 * ```
 */
export const addSlippage = (value: string, slippage: string) => {
  const biValue = parseEther(value)
  if (BigNumber(slippage).lte(0)) return biValue

  const slippagePercent = BigNumber(slippage).dividedBy(100).plus(1)
  const total = BigNumber(biValue.toString())
    .multipliedBy(slippagePercent)
    .toFixed(0)

  return BigInt(total)
}

/**
 * Subtract slippage from value.
 * @example
 * ```
 * subSlippage('1', '5')
 * // 1000000000000000000n === 1
 * ```
 */
export const subSlippage = (value: string, slippage: string) => {
  const biValue = parseEther(value)
  if (BigNumber(slippage).lte(0)) return biValue

  const slippagePercent = BigNumber(slippage).dividedBy(100).plus(1)
  const total = BigNumber(biValue.toString())
    .dividedBy(slippagePercent)
    .toFixed(0)

  return BigInt(total)
}
