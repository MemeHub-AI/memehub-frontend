import { distributorAbi0_1_0 } from './0.1.0'
import { distributorAbi0_1_2 } from './0.1.2'
import { distributorAbi0_1_6 } from './0.1.6'
import { distributorAbi0_1_7 } from './0.1.7'

export const distributorAbiMap = {
  '0.1.0': distributorAbi0_1_0,
  '0.1.2': distributorAbi0_1_2,
  '0.1.6': distributorAbi0_1_6,
  '0.1.7': distributorAbi0_1_7,
}

export type DistributorVersion = keyof typeof distributorAbiMap
