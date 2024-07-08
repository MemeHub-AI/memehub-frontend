import { BigNumber } from 'bignumber.js'
import { Hash, parseEther, Address, Log } from 'viem'
import dayjs from 'dayjs'
import { getBlock } from 'wagmi/actions'

import { DEPLOY_LOG_TOPIC } from '@/constants/deploy'
import { TRADE_SERVICE_FEE } from '@/constants/trade'
import { wagmiConfig } from '@/config/wagmi'
import { DEADLINE_SECONDS } from '@/constants/trade'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()
  return e.includes('user rejected') || e.includes('user denied')
}

// Make a config for contract.
export const makeConfig = <T = unknown>(abi: T, address: Address) => {
  return {
    abi,
    address,
  } as const
}

/**
 * @example
 * ```
 * addServiceFee('1') // amount
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
 * addSlippage('1', '5') // amount, slippage
 * // 1050000000000000000n = 1.05
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
 * subSlippage('1', '5') // amount, slippage
 * // 950000000000000000n === 0.95
 * ```
 */
export const subSlippage = (value: string, slippage: string) => {
  const biValue = parseEther(value)
  if (BigNumber(slippage).lte(0)) return biValue

  const slippagePercent = BigNumber(1).minus(BigNumber(slippage).div(100))
  const total = BigNumber(biValue.toString())
    .multipliedBy(slippagePercent)
    .toFixed(0)

  return BigInt(total)
}

// Add `0x` prefix.
export const addPrefix0x = (input: string | string[]) => {
  const arr = Array.isArray(input) ? input : [input]
  return arr.map((s) => '0x' + s) as Hash[]
}

// Get timestamp & plus offset seconds.
export const getDeadline = async () => {
  const addOffset = (value: bigint | number) => {
    return BigNumber(value.toString()).plus(DEADLINE_SECONDS).toFixed(0)
  }

  const ts = await getBlock(wagmiConfig)
    .then(({ timestamp }) => addOffset(timestamp))
    .catch(() => addOffset(dayjs().unix())) // Use local timestamp as fallback.

  return BigInt(ts)
}

export const getDeployLogAddr = (logs: Log<bigint, number, false>[]) => {
  const hashAddr = logs.find((l) => l.topics?.[0] === DEPLOY_LOG_TOPIC)
    ?.topics?.[1]
  const addr = hashAddr?.replace(/0x0+/, '') ?? ''

  return '0x' + addr
}

/**
 * @example
 * ```
 * const vIs = versionOf('V3.0.1')
 * // false
 * if (vIs(ContractVersion.V2)) {...}
 * // true
 * if (vIs(ContractVersion.V3)) {...}
 * ```
 */
export const versionOf = (originVersion: string) => {
  return (v: string) => originVersion.startsWith(v)
}
