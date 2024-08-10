import { tokenAbiV0_1_2 } from './0.1.2'

export const tokenAbiMap = {
  '0.1.2': tokenAbiV0_1_2,
}

export type TokenVersion = keyof typeof tokenAbiMap
