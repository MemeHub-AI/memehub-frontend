import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/core'
export type FactoryContent = {
  type: 0 | 1
  uri: string
}

export type FactoryConfig = {
  admin: Address
  jetton_code: Cell
  wallet_code: Cell
  bonding_curve_code: Cell
}

export function FactoryConfigToCell(config: FactoryConfig): Cell {
  return beginCell()
    .storeAddress(config.admin)
    .storeRef(config.jetton_code)
    .storeRef(config.wallet_code)
    .storeRef(config.bonding_curve_code)
    .endCell()
}

export class Factory implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Factory(address)
  }

  static createFromConfig(config: FactoryConfig, code: Cell, workchain = 0) {
    const data = FactoryConfigToCell(config)
    const init = { code, data }
    return new Factory(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  // 封装买币数据
  static buyJettonMessage(
    jetton_master_address: Address,
    user_pay_ton_for_jetton: bigint
  ) {
    return beginCell()
      .storeUint(0xcf838277, 32)
      .storeUint(0, 64)
      .storeAddress(jetton_master_address)
      .storeCoins(user_pay_ton_for_jetton)
      .endCell()
  }

  // 封装卖币数据
  static sellJettonMessage(
    jetton_master_address: Address,
    user_pay_ton_for_jetton: bigint
  ) {
    return beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)
      .storeAddress(jetton_master_address)
      .storeCoins(user_pay_ton_for_jetton)
      .endCell()
  }

  // 封装发币数据
  static depJettonMessage(content: Cell) {
    return beginCell()
      .storeUint(0x8fd6e0fb, 32)
      .storeUint(0, 64) // op, queryId
      .storeRef(content)
      .endCell()
  }
  // 发币
  async sendDeployJetton(
    provider: ContractProvider,
    via: Sender,
    content: Cell
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: Factory.depJettonMessage(content),
      value: toNano('0.13'),
    })
  }

  // 买币
  async sendBuyJettonMessage(
    provider: ContractProvider,
    via: Sender,
    jetton_master_address: Address,
    user_pay_ton_for_jetton: bigint
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: Factory.buyJettonMessage(
        jetton_master_address,
        user_pay_ton_for_jetton
      ),
      value: toNano('0.06') + user_pay_ton_for_jetton,
    })
  }

  // 卖币
  async sendSellJettonMessage(
    provider: ContractProvider,
    via: Sender,
    jetton_master_address: Address,
    user_pay_ton_for_jetton: bigint
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: Factory.sellJettonMessage(
        jetton_master_address,
        user_pay_ton_for_jetton
      ),
      value: toNano('0.06') + user_pay_ton_for_jetton,
    })
  }

  async getBondingCurveAddress(
    provider: ContractProvider,
    jetton_master_address: Address
  ): Promise<Address> {
    //获取联合曲线地址
    const res = await provider.get('get_bongding_curve_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(jetton_master_address).endCell(),
      },
    ])
    return res.stack.readAddress()
  }
}
