import { distributorAbi0_1_0 } from './0.1.0'
import { distributorAbi0_1_2 } from './0.1.2'
import { distributorAbi0_1_6 } from './0.1.6'
import { distributorAbi0_1_7 } from './0.1.7'
import { distributorAbi0_1_8 } from './0.1.8'
import { distributorAbi0_1_11 } from './0.1.11'
import { distributorAbi0_1_12 } from './0.1.12'
import { distributorAbi0_1_13 } from './0.1.13'
import { distributorAbi0_1_14 } from './0.1.14'
import { distributorAbi0_1_15 } from './0.1.15'
import { distributorAbi0_1_16 } from './0.1.16'
import { distributorAbi0_1_18 } from './0.1.18'
import { distributorAbi0_1_19 } from './0.1.19'
import { distributorAbi0_6_0 } from './0.6.0'
import { distributorAbi1_0_0 } from './1.0.0'

export const distributorAbiMap = {
  '0.1.0': distributorAbi0_1_0,
  '0.1.2': distributorAbi0_1_2,
  '0.1.6': distributorAbi0_1_6,
  '0.1.7': distributorAbi0_1_7,
  '0.1.8': distributorAbi0_1_8,
  '0.1.11': distributorAbi0_1_11,
  '0.1.12': distributorAbi0_1_12,
  '0.1.13': distributorAbi0_1_13,
  '0.1.14': distributorAbi0_1_14,
  '0.1.15': distributorAbi0_1_15,
  '0.1.16': distributorAbi0_1_16,
  '0.1.18': distributorAbi0_1_18,
  '0.1.19': distributorAbi0_1_19,
  '0.6.0': distributorAbi0_6_0,
  '1.0.0': distributorAbi1_0_0,
}

export type DistributorVersion = keyof typeof distributorAbiMap
