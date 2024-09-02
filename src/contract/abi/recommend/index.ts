import { recommendAbi0_1_0 } from './0.1.0'
import { recommendAbi0_1_8 } from './0.1.8'
import { recommendAbi0_1_9 } from './0.1.9'
import { recommendAbi0_1_11 } from './0.1.11'
import { recommendAbi0_1_12 } from './0.1.12'
import { recommendAbi0_1_14 } from './0.1.14'
import { recommendAbi0_1_13 } from './0.1.13'
import { recommendAbi0_1_15 } from './0.1.15'
import { recommendAbi0_1_17 } from './0.1.17'
import { recommendAbi0_6_0 } from './0.6.0'
import { recommendAbi1_0_0 } from './1.0.0'

export const recommendAbiMap = {
  '0.1.0': recommendAbi0_1_0,
  '0.1.8': recommendAbi0_1_8,
  '0.1.9': recommendAbi0_1_9,
  '0.1.11': recommendAbi0_1_11,
  '0.1.12': recommendAbi0_1_12,
  '0.1.13': recommendAbi0_1_13,
  '0.1.14': recommendAbi0_1_14,
  '0.1.15': recommendAbi0_1_15,
  '0.1.17': recommendAbi0_1_17,
  '0.6.0': recommendAbi0_6_0,
  '1.0.0': recommendAbi1_0_0,
}

export type RecommendVersion = keyof typeof recommendAbiMap
