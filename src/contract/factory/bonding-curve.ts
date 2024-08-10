import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
} from '@ton/core'
export type BondingCurveContent = {
  type: 0 | 1
  uri: string
}
// Factory User-defined configuration
export type BondingCurveConfig = {
  virtualTokenReserve: bigint
  virtualTonReserve: bigint
  jetton_master_address: Address
  factory_address: Address
}
// Factory configuration is converted to Cell type data
export function BondingCurveConfigToCell(config: BondingCurveConfig): Cell {
  return beginCell()
    .storeCoins(config.virtualTokenReserve)
    .storeCoins(config.virtualTonReserve)
    .storeAddress(config.jetton_master_address)
    .storeAddress(config.factory_address)
    .endCell()
}

export class Bondingcurve implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Bondingcurve(address)
  }

  static createFromConfig(
    config: BondingCurveConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = BondingCurveConfigToCell(config)
    const init = { code, data }
    return new Bondingcurve(contractAddress(workchain, init), init)
  }

  async get_out_jetton(
    provider: ContractProvider,
    in_ton: bigint
  ): Promise<bigint> {
    const res = await provider.get('get_out_jetton', [
      { type: 'int', value: in_ton },
    ])
    return res.stack.readBigNumber()
  }

  async get_out_ton(
    provider: ContractProvider,
    jetton_acount_in: bigint
  ): Promise<bigint> {
    const res = await provider.get('get_out_ton', [
      { type: 'int', value: jetton_acount_in },
    ])
    return res.stack.readBigNumber()
  }
}
