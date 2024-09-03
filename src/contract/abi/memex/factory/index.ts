import { memexFactoryAbi0_1_15 } from './0.1.15'
import { memexFactoryAbi0_1_16 } from './0.1.16'
import { memexFactoryAbi0_1_17 } from './0.1.17'
import { memexFactoryAbi0_1_18 } from './0.1.18'
import { memexFactoryAbi0_1_19 } from './0.1.19'
import { memexFactoryAbi0_1_20 } from './0.1.20'
import { memexFactoryAbi0_1_21 } from './0.1.21'
import { memexFactoryAbi0_1_22 } from './0.1.22'
import { memexFactoryAbi0_1_23 } from './0.1.23'
import { memexFactoryAbi0_1_24 } from './0.1.24'
import { memexFactoryAbi0_1_25 } from './0.1.25'
import { memexFactoryAbi0_2_0 } from './0.2.0'
import { memexFactoryAbi0_2_1 } from './0.2.1'
import { memexFactoryAbi0_2_2 } from './0.2.2'
import { memexFactoryAbi0_5_0 } from './0.5.0'
import { memexFactoryAbi0_6_0 } from './0.6.0'
import { memexFactoryAbi0_7_0 } from './0.7.0'
import { memexFactoryAbi0_7_1 } from './0.7.1'
import { memexFactoryAbi0_7_2 } from './0.7.2'
import { memexFactoryAbi1_0_0 } from './1.0.0'

export const memexFactoryAbiMap = {
  '0.1.15': memexFactoryAbi0_1_15,
  '0.1.16': memexFactoryAbi0_1_16,
  '0.1.17': memexFactoryAbi0_1_17,
  '0.1.18': memexFactoryAbi0_1_18,
  '0.1.19': memexFactoryAbi0_1_19,
  '0.1.20': memexFactoryAbi0_1_20,
  '0.1.21': memexFactoryAbi0_1_21,
  '0.1.22': memexFactoryAbi0_1_22,
  '0.1.23': memexFactoryAbi0_1_23,
  '0.1.24': memexFactoryAbi0_1_24,
  '0.1.25': memexFactoryAbi0_1_25,
  '0.2.0': memexFactoryAbi0_2_0,
  '0.2.1': memexFactoryAbi0_2_1,
  '0.2.2': memexFactoryAbi0_2_2,
  '0.5.0': memexFactoryAbi0_5_0,
  '0.6.0': memexFactoryAbi0_6_0,
  '0.7.0': memexFactoryAbi0_7_0,
  '0.7.1': memexFactoryAbi0_7_1,
  '0.7.2': memexFactoryAbi0_7_2,
  '1.0.0': memexFactoryAbi1_0_0,
} as const

export type MemexFactoryVersion = keyof typeof memexFactoryAbiMap
