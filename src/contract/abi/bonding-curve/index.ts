import { bcAbi0_1_0 } from './0.1.0'
import { bcAbi0_1_1 } from './0.1.1'
import { bcAbi0_1_2 } from './0.1.2'
import { bcAbi0_1_6 } from './0.1.6'
import { bcAbi0_1_7 } from './0.1.7'
import { bcAbi0_1_9 } from './0.1.9'
import { bcAbi0_1_11 } from './0.1.11'
import { bcAbi0_1_12 } from './0.1.12'

export const bcAbiMap = {
  '0.1.0': bcAbi0_1_0,
  '0.1.1': bcAbi0_1_1,
  '0.1.2': bcAbi0_1_2,
  '0.1.6': bcAbi0_1_6,
  '0.1.7': bcAbi0_1_7,
  '0.1.9': bcAbi0_1_9,
  '0.1.11': bcAbi0_1_11,
  '0.1.12': bcAbi0_1_12,
} as const

export type BcVersion = keyof typeof bcAbiMap
