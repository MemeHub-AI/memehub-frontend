import { distributorAbi0_1_0 } from './0.1.0'
import { distributorAbi0_1_2 } from './0.1.2'
import { distributorAbi0_1_6 } from './0.1.6'
import { distributorAbi0_1_7 } from './0.1.7'
import { distributorAbi0_1_8 } from './0.1.8'
import { distributorAbi0_1_11 } from './0.1.11'
import { distributorAbi0_1_12 } from './0.1.12'

export const distributorAbiMap = {
  '0.1.0': distributorAbi0_1_0,
  '0.1.2': distributorAbi0_1_2,
  '0.1.6': distributorAbi0_1_6,
  '0.1.7': distributorAbi0_1_7,
  '0.1.8': distributorAbi0_1_8,
  '0.1.11': distributorAbi0_1_11,
  '0.1.12': distributorAbi0_1_12,
}

export type DistributorVersion = keyof typeof distributorAbiMap
