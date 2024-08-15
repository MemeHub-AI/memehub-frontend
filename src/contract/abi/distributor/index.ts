import { distributorAbiV0_1_0 } from './0.1.0'
import { distributorAbiV0_1_2 } from './0.1.2'
import { distributorAbiV0_1_6 } from './0.1.6'

export const distributorAbiMap = {
  '0.1.0': distributorAbiV0_1_0,
  '0.1.2': distributorAbiV0_1_2,
  '0.1.6': distributorAbiV0_1_6,
}

export type DistributorVersion = keyof typeof distributorAbiMap
