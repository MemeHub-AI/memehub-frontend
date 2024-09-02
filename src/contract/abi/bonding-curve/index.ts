import { bcAbi0_1_0 } from './0.1.0'
import { bcAbi0_1_1 } from './0.1.1'
import { bcAbi0_1_2 } from './0.1.2'
import { bcAbi0_1_6 } from './0.1.6'
import { bcAbi0_1_7 } from './0.1.7'
import { bcAbi0_1_9 } from './0.1.9'
import { bcAbi0_1_11 } from './0.1.11'
import { bcAbi0_1_12 } from './0.1.12'
import { bcAbi0_1_14 } from './0.1.14'
import { bcAbi0_1_15 } from './0.1.15'
import { bcAbi0_1_16 } from './0.1.16'
import { bcAbi0_2_0 } from './0.2.0'
import { bcAbi0_2_2 } from './0.2.2'
import { bcAbi0_6_0 } from './0.6.0'
import { bcAbi1_0_0 } from './1.0.0'

export const bcAbiMap = {
  '0.1.0': bcAbi0_1_0,
  '0.1.1': bcAbi0_1_1,
  '0.1.2': bcAbi0_1_2,
  '0.1.6': bcAbi0_1_6,
  '0.1.7': bcAbi0_1_7,
  '0.1.9': bcAbi0_1_9,
  '0.1.11': bcAbi0_1_11,
  '0.1.12': bcAbi0_1_12,
  '0.1.14': bcAbi0_1_14,
  '0.1.15': bcAbi0_1_15,
  '0.1.16': bcAbi0_1_16,
  '0.2.0': bcAbi0_2_0,
  '0.2.2': bcAbi0_2_2,
  '0.6.0': bcAbi0_6_0,
  '1.0.0': bcAbi1_0_0,
} as const

export type BcVersion = keyof typeof bcAbiMap
