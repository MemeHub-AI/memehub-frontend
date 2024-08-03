import { tokenAbiV0_2_0 } from './0.2.0'

export enum TokenAbiVersion {
  V0_2_0 = '0.2.0',
}

export const tokenAbiMap = {
  [TokenAbiVersion.V0_2_0]: tokenAbiV0_2_0,
}
