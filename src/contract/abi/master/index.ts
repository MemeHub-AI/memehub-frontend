import { masterAbi0_1_18 } from './0.1.8'
import { masterAbi0_6_0 } from './0.6.0'

export const masterAbiMap = {
  '0.1.8': masterAbi0_1_18,
  '0.6.0': masterAbi0_6_0,
}

export const masterAbiLatest = masterAbiMap['0.6.0']

export type MasterVersion = keyof typeof masterAbiMap
