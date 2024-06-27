export const BI_ZERO = BigInt(0)

export const BI_ZERO_TUPLE = [BI_ZERO, BI_ZERO] as const

// Make sure to update this when you update the contract.
export enum ContractVersion {
  V1 = 'V1',

  V2 = 'V2',

  V3 = 'V3',

  // d === dot
  V3d0d1 = 'V3.0.1',
}

/******************** Deploy related ********************/
export const DEPLOY_FEE = {
  v1: BigInt(2000671350000000),
  v2: BigInt(1500000000000000),
  v3: BigInt(2000000000000000),
}

export const DEPLOY_VERSION = ContractVersion.V3d0d1

export const DEPLOY_LOG_TOPIC =
  '0x556e2663f9312acdff6b3f6554a68d7f1b6e64a832778c7abac899b58961bb4e'
/******************** Deploy related ********************/

/******************** Trade related ********************/
export const TRADE_SERVICE_FEE = 1.01 // 1%

export const TRADE_BUY_ITEMS = {
  eth: ['0.05', '0.1', '0.2', '0.5'],
  bnb: ['0.2', '0.5', '1', '2'],
  zk: ['500', '1000', '3000', '5000'],
  ftm: ['150', '300', '600', '1000'],
  matic: ['150', '300', '600', '1000'],

  btc: ['0.004', '0.008', '0.016', '0.03'],
} as const
/******************** Trade related ********************/
