import { tokenAbiV0_1_2 } from './0.1.2'
import { tokenAbiV0_1_6 } from './0.1.6'

export const tokenAbiMap = {
  '0.1.2': tokenAbiV0_1_2,
  '0.1.6': tokenAbiV0_1_6,
}

export type TokenVersion = keyof typeof tokenAbiMap
