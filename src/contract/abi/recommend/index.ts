import { recommendAbi0_1_0 } from './0.1.0'
import { recommendAbi0_1_8 } from './0.1.8'

export const recommendAbiMap = {
  '0.1.0': recommendAbi0_1_0,
  '0.1.8': recommendAbi0_1_8,
}

export type RecommendVersion = keyof typeof recommendAbiMap
