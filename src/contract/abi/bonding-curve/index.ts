import { bcAbiV0_1_0 } from './0.1.0'
import { bcAbiV0_1_1 } from './0.1.1'

export const bcAbiMap = {
  '0.1.0': bcAbiV0_1_0,
  '0.1.1': bcAbiV0_1_1,
  '0.1.2': bcAbiV0_1_1, // same as 0.1.1, not an error
} as const

export type BcVersion = keyof typeof bcAbiMap
