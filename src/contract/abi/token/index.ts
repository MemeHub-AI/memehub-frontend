import { tokenAbiV0_1_2 } from './0.1.2'
import { tokenAbiV0_2_0 } from './0.2.0'

export const tokenAbiMap = {
  '0.1.2': tokenAbiV0_1_2,
  '0.2.0': tokenAbiV0_2_0,
}

export type TokenVersion = keyof typeof tokenAbiMap
