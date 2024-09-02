import { memexIdoAbi0_1_15 } from './0.1.15'
import { memexIdoAbi0_1_16 } from './0.1.16'
import { memexIdoAbi0_1_17 } from './0.1.17'
import { memexIdoAbi0_1_18 } from './0.1.18'
import { memexIdoAbi0_1_19 } from './0.1.19'
import { memexIdoAbi0_1_20 } from './0.1.20'
import { memexIdoAbi0_1_21 } from './0.1.21'
import { memexIdoAbi0_1_22 } from './0.1.22'
import { memexIdoAbi0_1_23 } from './0.1.23'
import { memexIdoAbi0_1_24 } from './0.1.24'
import { memexIdoAbi0_1_25 } from './0.1.25'
import { memexIdoAbi0_2_0 } from './0.2.0'
import { memexIdoAbi0_2_1 } from './0.2.1'
import { memexIdoAbi0_2_2 } from './0.2.2'
import { memexIdoAbi0_5_0 } from './0.5.0'
import { memexIdoAbi0_6_0 } from './0.6.0'
import { memexIdoAbi0_7_0 } from './0.7.0'
import { memexIdoAbi0_7_1 } from './0.7.1'
import { memexIdoAbi0_7_2 } from './0.7.2'
import { memexIdoAbi1_0_0 } from './1.0.0'

export const memexIdoAbiMap = {
  '0.1.15': memexIdoAbi0_1_15,
  '0.1.16': memexIdoAbi0_1_16,
  '0.1.17': memexIdoAbi0_1_17,
  '0.1.18': memexIdoAbi0_1_18,
  '0.1.19': memexIdoAbi0_1_19,
  '0.1.20': memexIdoAbi0_1_20,
  '0.1.21': memexIdoAbi0_1_21,
  '0.1.22': memexIdoAbi0_1_22,
  '0.1.23': memexIdoAbi0_1_23,
  '0.1.24': memexIdoAbi0_1_24,
  '0.1.25': memexIdoAbi0_1_25,
  '0.2.0': memexIdoAbi0_2_0,
  '0.2.1': memexIdoAbi0_2_1,
  '0.2.2': memexIdoAbi0_2_2,
  '0.5.0': memexIdoAbi0_5_0,
  '0.6.0': memexIdoAbi0_6_0,
  '0.7.0': memexIdoAbi0_7_0,
  '0.7.1': memexIdoAbi0_7_1,
  '0.7.2': memexIdoAbi0_7_2,
  '1.0.0': memexIdoAbi1_0_0,
}

export const memexIdoLatest = memexIdoAbiMap['0.7.2']

export type MemexIdoVersion = keyof typeof memexIdoAbiMap
