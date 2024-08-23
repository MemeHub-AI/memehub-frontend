import { memexIdoAbi0_1_15 } from './0.1.15'
import { memexIdoAbi0_1_16 } from './0.1.16'
import { memexIdoAbi0_1_17 } from './0.1.17'
import { memexIdoAbi0_1_18 } from './0.1.18'
import { memexIdoAbi0_1_19 } from './0.1.19'
import { memexIdoAbi0_1_20 } from './0.1.20'
import { memexIdoAbi0_1_21 } from './0.1.21'

export const memexIdoAbiMap = {
  '0.1.15': memexIdoAbi0_1_15,
  '0.1.16': memexIdoAbi0_1_16,
  '0.1.17': memexIdoAbi0_1_17,
  '0.1.18': memexIdoAbi0_1_18,
  '0.1.19': memexIdoAbi0_1_19,
  '0.1.20': memexIdoAbi0_1_20,
  '0.1.21': memexIdoAbi0_1_21,
}

export type MemexIdoVersion = keyof typeof memexIdoAbiMap
