import { memexFactoryAbi0_1_15 } from './0.1.15'
import { memexFactoryAbi0_1_16 } from './0.1.16'
import { memexFactoryAbi0_1_17 } from './0.1.17'

export const memexFactoryAbiMap = {
  '0.1.15': memexFactoryAbi0_1_15,
  '0.1.16': memexFactoryAbi0_1_16,
  '0.1.17': memexFactoryAbi0_1_17,
} as const

export type MemexFactoryVersion = keyof typeof memexFactoryAbiMap
