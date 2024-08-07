import { Address, OpenedContract, toNano } from '@ton/core'
import { useConnection } from './use-connection'
import { useInit } from './use-init'
import { useTonClient } from './use-ton-client'
import { useTonAddress } from '@tonconnect/ui-react'
import { useTonMainAddress } from '../use-ton-address'
import { JettonMinter } from '@/contract/factory/jetton-minter'
import { JettonWallet } from '@/contract/factory/jetton-wallet'

export const useSellContactsWrapper = () => {
  const client = useTonClient()
  const { sender } = useConnection()
  const userFriendlyAddress = useTonAddress()
  const { jetton_mastter_address, factory_address } = useTonMainAddress()

  // Required jetton master contract address
  const jetton_master = useInit(async () => {
    if (!client) return

    const contract = JettonMinter.createFromAddress(
      Address.parse(jetton_mastter_address)
    )
    return client.open(contract) as OpenedContract<JettonMinter>
  }, [client])

  // Requires the user's wallet address
  const user_jetton_wallet_address = useInit(async () => {
    if (!client || !jetton_master || userFriendlyAddress.length === 0) return

    const contract = JettonWallet.createFromAddress(
      await jetton_master.getWalletAddress(Address.parse(userFriendlyAddress))
    )

    return client.open(contract) as OpenedContract<JettonWallet>
  }, [jetton_master, userFriendlyAddress])

  // Sell coins
  const sellCoins = async (amount: number, coinKey: string) => {
    await user_jetton_wallet_address?.sendTransfer(
      sender,
      toNano('0.07'), //value
      toNano(amount), //amount
      Address.parse(factory_address), //factory contract
      sender.address!, //response
      null,
      toNano('0.035'),
      Address.parse(coinKey) // jetton_address
    )
  }

  const getJettonBalance = async () => {
    const balance =
      Number(await user_jetton_wallet_address?.getJettonBalance()) / 1000000000
    return balance
  }

  return { sellCoins, getJettonBalance }
}
