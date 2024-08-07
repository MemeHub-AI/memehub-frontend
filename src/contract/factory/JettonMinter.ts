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

export type JettonMinterContent = {
  type: 0 | 1
  uri: string
}
export type JettonMinterConfig = {
  admin: Address
  content: Cell
  walconst_code: Cell
}

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  return beginCell()
    .storeCoins(0) //total_supply
    .storeAddress(config.admin) //admin_address
    .storeRef(config.content) //content(jetton data)
    .storeRef(config.walconst_code) //jetton_walconst_code
    .endCell()
}

export function jettonContentToCell(content: JettonMinterContent) {
  return beginCell()
    .storeUint(content.type, 8)
    .storeStringTail(content.uri)
    .endCell()
}

export class JettonMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMinter(address)
  }

  static createFromConfig(
    config: JettonMinterConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonMinterConfigToCell(config)
    const init = { code, data }
    return new JettonMinter(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  static mintMessage(to: Address, amount: bigint, master_msg: Cell) {
    return beginCell()
      .storeUint(0x15, 32)
      .storeUint(0, 64) // op, queryId
      .storeAddress(to)
      .storeCoins(amount)
      .storeRef(master_msg)
      .endCell()
  }
  static internalTransferMessage(
    jetton_amount: bigint,
    from_address: Address,
    response_address: Address,
    forward_ton_amount: bigint
  ) {
    return beginCell()
      .storeUint(0x178d4519, 32)
      .storeUint(0, 64) // op, queryId
      .storeCoins(jetton_amount)
      .storeAddress(from_address)
      .storeAddress(response_address)
      .storeCoins(forward_ton_amount)
      .endCell()
  }
  async sendMint(
    provider: ContractProvider,
    via: Sender,
    to: Address,
    amount: bigint,
    jetton_amount: bigint,
    from_address: Address,
    response_address: Address,
    forward_ton_amount: bigint
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonMinter.mintMessage(
        to,
        amount,
        JettonMinter.internalTransferMessage(
          jetton_amount,
          from_address,
          response_address,
          forward_ton_amount
        )
      ),
      value: toNano(0.01) + amount + forward_ton_amount,
    })
  }
  /* provide_walconst_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
   */
  static discoveryMessage(owner: Address, include_address: boolean) {
    return beginCell()
      .storeUint(0x2c76b973, 32)
      .storeUint(0, 64) // op, queryId
      .storeAddress(owner)
      .storeBit(include_address)
      .endCell()
  }

  async sendDiscovery(
    provider: ContractProvider,
    via: Sender,
    owner: Address,
    include_address: boolean,
    value: bigint = toNano('0.1')
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonMinter.discoveryMessage(owner, include_address),
      value: value,
    })
  }

  static changeAdminMessage(newOwner: Address) {
    // Modify administrator
    return beginCell()
      .storeUint(0x4840664f, 32)
      .storeUint(0, 64) // op, queryId
      .storeAddress(newOwner)
      .endCell()
  }

  async sendChangeAdmin(
    provider: ContractProvider,
    via: Sender,
    newOwner: Address
  ) {
    await provider.internal(via, {
      // The modify administrator message was sent
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonMinter.changeAdminMessage(newOwner),
      value: toNano('0.1'),
    })
  }
  static changeContentMessage(content: Cell) {
    // Modify token information
    return beginCell()
      .storeUint(0x5773d1f5, 32)
      .storeUint(0, 64) // op, queryId
      .storeRef(content)
      .endCell()
  }

  async sendChangeContent(
    provider: ContractProvider,
    via: Sender,
    content: Cell
  ) {
    await provider.internal(via, {
      // Send modification token information
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonMinter.changeContentMessage(content),
      value: toNano('0.1'),
    })
  }
  async getWalletAddress(
    provider: ContractProvider,
    owner: Address
  ): Promise<Address> {
    const res = await provider.get('get_wallet_address', [
      { type: 'slice', cell: beginCell().storeAddress(owner).endCell() },
    ])
    return res.stack.readAddress()
  }

  async getJettonData(provider: ContractProvider) {
    // Get token details
    const res = await provider.get('get_jetton_data', [])
    const totalSupply = res.stack.readBigNumber()
    const mintable = res.stack.readBoolean()
    const adminAddress = res.stack.readAddress()
    const content = res.stack.readCell()
    const walconstCode = res.stack.readCell()
    return {
      totalSupply,
      mintable,
      adminAddress,
      content,
      walconstCode,
    }
  }

  async getTotalSupply(provider: ContractProvider) {
    // Total number of coins in circulation
    const res = await this.getJettonData(provider)
    return res.totalSupply
  }
  async getAdminAddress(provider: ContractProvider) {
    // Get administrator address
    const res = await this.getJettonData(provider)
    return res.adminAddress
  }
  async getContent(provider: ContractProvider) {
    const res = await this.getJettonData(provider)
    return res.content
  }
}
