import { tokenAbi0_1_2 } from './0.1.2'
import { tokenAbi0_1_6 } from './0.1.6'
import { tokenAbi0_1_7 } from './0.1.7'
import { tokenAbi0_1_8 } from './0.1.8'
import { tokenAbi0_1_9 } from './0.1.9'
import { tokenAbi0_1_11 } from './0.1.11'
import { tokenAbi0_1_12 } from './0.1.12'
import { tokenAbi0_1_14 } from './0.1.14'

export const tokenAbiMap = {
  '0.1.2': tokenAbi0_1_2,
  '0.1.6': tokenAbi0_1_6,
  '0.1.7': tokenAbi0_1_7,
  '0.1.8': tokenAbi0_1_8,
  '0.1.9': tokenAbi0_1_9,
  '0.1.11': tokenAbi0_1_11,
  '0.1.12': tokenAbi0_1_12,
  '0.1.14': tokenAbi0_1_14,
}

export type TokenVersion = keyof typeof tokenAbiMap
