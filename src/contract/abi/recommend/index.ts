import { recommendAbi0_1_0 } from './0.1.0'
import { recommendAbi0_1_8 } from './0.1.8'
import { recommendAbi0_1_9 } from './0.1.9'

export const recommendAbiMap = {
  '0.1.0': recommendAbi0_1_0,
  '0.1.8': recommendAbi0_1_8,
  '0.1.9': recommendAbi0_1_9,
}

export type RecommendVersion = keyof typeof recommendAbiMap
