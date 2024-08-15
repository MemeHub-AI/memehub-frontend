import { bcAbiV0_1_0 } from './0.1.0'
import { bcAbiV0_1_1 } from './0.1.1'
import { bcAbiV0_1_2 } from './0.1.2'
import { bcAbiV0_1_6 } from './0.1.6'

export const bcAbiMap = {
  '0.1.0': bcAbiV0_1_0,
  '0.1.1': bcAbiV0_1_1,
  '0.1.2': bcAbiV0_1_2, // same as 0.1.1, not an error
  '0.1.6': bcAbiV0_1_6,
} as const

export type BcVersion = keyof typeof bcAbiMap
