import { BigNumber } from 'bignumber.js'
import { parseEther } from 'viem'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()

  return e.includes('user rejected') || e.includes('user denied')
}

const SERVICE_FEE = 1.01 // 1%

// Add service fee when trade.
export const addServiceFee = (amount: string) => {
  const amountBigint = parseEther(amount)
  const total = BigNumber(amountBigint.toString())
    .multipliedBy(SERVICE_FEE)
    .toFixed(0)

  return BigInt(total)
}
