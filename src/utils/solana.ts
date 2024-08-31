import { web3 } from '@coral-xyz/anchor'
import { BigNumber } from 'bignumber.js'

export const formatSol = (amount: number) => {
  return BigNumber(amount).div(web3.LAMPORTS_PER_SOL).toFixed()
}

export const parseSol = (amount: number) => {
  return BigNumber(amount).multipliedBy(web3.LAMPORTS_PER_SOL).toNumber()
}

export const isSolAddress = (addr: string) => {
  try {
    return web3.PublicKey.isOnCurve(addr)
  } catch (err) {
    return false
  }
}
