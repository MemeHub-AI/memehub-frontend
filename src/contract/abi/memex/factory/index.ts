import { memexFactoryAbi0_1_15 } from './0.1.15'
import { memexFactoryAbi0_1_16 } from './0.1.16'

export const memexFactoryAbiMap = {
  '0.1.15': memexFactoryAbi0_1_15,
  '0.1.16': memexFactoryAbi0_1_16,
}

export type MemexFactoryVersion = keyof typeof memexFactoryAbiMap
