import { memexIdoAbi0_1_15 } from './0.1.15'
import { memexIdoAbi0_1_16 } from './0.1.16'

export const memexIdoAbiMap = {
  '0.1.15': memexIdoAbi0_1_15,
  '0.1.16': memexIdoAbi0_1_16,
}

export type MemexIdoVersion = keyof typeof memexIdoAbiMap
