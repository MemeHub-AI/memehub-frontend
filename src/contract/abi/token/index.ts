import { tokenAbi0_1_2 } from './0.1.2'
import { tokenAbi0_1_6 } from './0.1.6'
import { tokenAbi0_1_7 } from './0.1.7'
import { tokenAbi0_1_8 } from './0.1.8'
import { tokenAbi0_1_9 } from './0.1.9'
import { tokenAbi0_1_11 } from './0.1.11'
import { tokenAbi0_1_12 } from './0.1.12'
import { tokenAbi0_1_14 } from './0.1.14'
import { tokenAbi0_1_15 } from './0.1.15'
import { tokenAbi0_1_16 } from './0.1.16'
import { tokenAbi0_2_0 } from './0.2.0'
import { tokenAbi0_2_1 } from './0.2.1'
import { tokenAbi0_2_2 } from './0.2.2'
import { tokenAbi0_6_0 } from './0.6.0'
import { tokenAbi1_0_0 } from './1.0.0'

export const tokenAbiMap = {
  '0.1.2': tokenAbi0_1_2,
  '0.1.6': tokenAbi0_1_6,
  '0.1.7': tokenAbi0_1_7,
  '0.1.8': tokenAbi0_1_8,
  '0.1.9': tokenAbi0_1_9,
  '0.1.11': tokenAbi0_1_11,
  '0.1.12': tokenAbi0_1_12,
  '0.1.14': tokenAbi0_1_14,
  '0.1.15': tokenAbi0_1_15,
  '0.1.16': tokenAbi0_1_16,
  '0.2.0': tokenAbi0_2_0,
  '0.2.1': tokenAbi0_2_1,
  '0.2.2': tokenAbi0_2_2,
  '0.6.0': tokenAbi0_6_0,
  '1.0.0': tokenAbi1_0_0,
}

export type TokenVersion = keyof typeof tokenAbiMap
