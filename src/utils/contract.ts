import { BigNumber } from 'bignumber.js'
import { Hash, parseEther, Log } from 'viem'
import dayjs from 'dayjs'
import { getBlock } from 'wagmi/actions'

import { DEPLOY_LOG_ADDR } from '@/constants/deploy'
import { wagmiConfig } from '@/config/wagmi'

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()
  return e.includes('user rejected') || e.includes('user denied')
}

/**
 * Add slippage to value.
 * @example
 * ```ts
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
 * ```ts
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

/** Add `0x` prefix. */
export const addPrefix0x = (input: string | string[]) => {
  input = Array.isArray(input) ? input : [input]
  return input.map((s) => (s.startsWith('0x') ? s : '0x' + s)) as Hash[]
}

/**
 * Get timestamp of block chain & plus offset seconds,
 * use local timestamp as fallback.
 * @default seconds `300`(5m)
 */
export const getDeadline = async (seconds = 300) => {
  const addOffset = (value: bigint | number) => {
    return BigNumber(value.toString()).plus(seconds).toFixed(0)
  }

  const ts = await getBlock(wagmiConfig)
    .then(({ timestamp }) => addOffset(timestamp))
    .catch(() => addOffset(dayjs().unix())) // fallback.

  return BigInt(ts)
}

export const getDeployLogsAddr = (logs: Log<bigint, number, false>[]) => {
  const log = logs.find((l) => l.topics?.[0] === DEPLOY_LOG_ADDR)
  const hashAddr = log?.topics?.[1]
  // Attention, here breaks the address starting with 0.
  const normalAddr = hashAddr?.replace(/0x0+/, '') ?? ''

  return normalAddr.length < 40
    ? `$0x${normalAddr.padStart(40, '0')}`
    : `0x${normalAddr}`
}

/**
 * @example
 * ```ts
 * const hash = parseHash(BigInt('743682847302839237012018537797613726790590966769178093576926872255665103969'))
 * // 0x01a4e8d9e9ec74503ba4d82cc1305e238cb3e9d9d40f062201a5a40aba356461
 * ```
 */
export const parseHash = (value: bigint, with0x = true) => {
  const hex = value.toString(16).padStart(64, '0')
  return with0x ? addPrefix0x(hex)[0] : hex
}
