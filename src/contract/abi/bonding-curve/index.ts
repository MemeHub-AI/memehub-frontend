import { bondingCurveAbiV0_1_0 } from './0.1.0'

export enum BcAbiVersion {
  V0_1_0 = '0.1.0',
}

export const bondingCurveAbiMap = {
  [BcAbiVersion.V0_1_0]: bondingCurveAbiV0_1_0,
} as const
