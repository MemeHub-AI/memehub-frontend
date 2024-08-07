import { distributorAbiV0_1_0 } from './0.1.0'

export const distributorAbiMap = {
  '0.1.0': distributorAbiV0_1_0,
}

export type DistributorVersion = keyof typeof distributorAbiMap
