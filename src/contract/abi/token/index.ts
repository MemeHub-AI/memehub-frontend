import { tokenAbi0_1_2 } from './0.1.2'
import { tokenAbi0_1_6 } from './0.1.6'
import { tokenAbi0_1_7 } from './0.1.7'

export const tokenAbiMap = {
  '0.1.2': tokenAbi0_1_2,
  '0.1.6': tokenAbi0_1_6,
  '0.1.7': tokenAbi0_1_7,
}

export type TokenVersion = keyof typeof tokenAbiMap
