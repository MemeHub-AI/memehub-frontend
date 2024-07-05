import { ContractVersion } from './contract'

export const DEPLOY_LOG_TOPIC =
  '0x556e2663f9312acdff6b3f6554a68d7f1b6e64a832778c7abac899b58961bb4e'

export const DEPLOY_FEE = {
  v1: BigInt(2000671350000000),
  v2: BigInt(1500000000000000),
  v3: BigInt(2000000000000000),
}

export const DEPLOY_VERSION = ContractVersion.V3
