import { bondingCurve0d1d0Abi } from './0.1.0'

export const bondingCurveAbiMap = {
  '0.1.0': bondingCurve0d1d0Abi,
} as const

export type BondingCurveAbiKeys = keyof typeof bondingCurveAbiMap
