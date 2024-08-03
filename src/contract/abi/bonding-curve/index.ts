import { bondingCurve0d1d0Abi } from './0.1.0'

export enum BCVersion {
  v0d1d0 = '0.1.0',
}

export const bondingCurveAbiMap = {
  [BCVersion.v0d1d0]: bondingCurve0d1d0Abi,
} as const
