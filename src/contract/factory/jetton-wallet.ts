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
import { Maybe } from '@ton/core/dist/utils/maybe'

export type JettonWalletConfig = {
  owner_address: Address
  jetton_master_address: Address
  jetton_wallet_code: Cell
}

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.owner_address)
    .storeAddress(config.jetton_master_address)
    .storeRef(config.jetton_wallet_code)
    .endCell()
}

export class JettonWallet implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new JettonWallet(address)
  }

  static createFromConfig(
    config: JettonWalletConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonWalletConfigToCell(config)
    const init = { code, data }
    return new JettonWallet(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async getJettonBalance(provider: ContractProvider) {
    const state = await provider.getState()
    if (state.state.type !== 'active') {
      return BigInt(0)
    }
    const res = await provider.get('get_wallet_data', [])
    return res.stack.readBigNumber()
  }
  static transferMessage(
    jetton_amount: bigint,
    to: Address,
    responseAddress: Address,
    customPayload: Maybe<Cell>,
    forward_ton_amount: bigint,
    forwardPayload: Address
  ) {
    return beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64) // op, queryId
      .storeCoins(jetton_amount)
      .storeAddress(to)
      .storeAddress(responseAddress)
      .storeMaybeRef(customPayload)
      .storeCoins(forward_ton_amount)
      .storeInt(0, 2)
      .storeAddress(forwardPayload)
      .endCell()
  }
  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    jetton_amount: bigint,
    to: Address,
    responseAddress: Address,
    customPayload: Maybe<Cell>,
    forward_ton_amount: bigint,
    forwardPayload?: Address
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonWallet.transferMessage(
        jetton_amount,
        to,
        responseAddress,
        customPayload,
        forward_ton_amount,
        forwardPayload!
      ),
      value: value,
    })
  }
  /*
      burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
                    response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                    = InternalMsgBody;
    */
  static burnMessage(
    jetton_amount: bigint,
    responseAddress: Address,
    customPayload: Cell
  ) {
    return beginCell()
      .storeUint(0x595f07bc, 32)
      .storeUint(0, 64) // op, queryId
      .storeCoins(jetton_amount)
      .storeAddress(responseAddress)
      .storeMaybeRef(customPayload)
      .endCell()
  }

  async sendBurn(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    jetton_amount: bigint,
    responseAddress: Address,
    customPayload: Cell
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonWallet.burnMessage(
        jetton_amount,
        responseAddress,
        customPayload
      ),
      value: value,
    })
  }
  /*
      withdraw_tons#107c49ef query_id:uint64 = InternalMsgBody;
    */
  static withdrawTonsMessage() {
    return beginCell()
      .storeUint(0x6d8e5e3c, 32)
      .storeUint(0, 64) // op, queryId
      .endCell()
  }

  async sendWithdrawTons(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonWallet.withdrawTonsMessage(),
      value: toNano('0.1'),
    })
  }
  /*
      withdraw_jettons#10 query_id:uint64 wallet:MsgAddressInt amount:Coins = InternalMsgBody;
    */
  static withdrawJettonsMessage(from: Address, amount: bigint) {
    return beginCell()
      .storeUint(0x768a50b2, 32)
      .storeUint(0, 64) // op, queryId
      .storeAddress(from)
      .storeCoins(amount)
      .storeMaybeRef(null)
      .endCell()
  }

  async sendWithdrawJettons(
    provider: ContractProvider,
    via: Sender,
    from: Address,
    amount: bigint
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonWallet.withdrawJettonsMessage(from, amount),
      value: toNano('0.1'),
    })
  }
}
