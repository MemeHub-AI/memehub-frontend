import { masterAbi0_1_18 } from './0.1.8'

export const masterAbiMap = {
  '0.1.8': masterAbi0_1_18,
}

export const masterAbiLatest = masterAbiMap['0.1.8']

export type MasterVersion = keyof typeof masterAbiMap
