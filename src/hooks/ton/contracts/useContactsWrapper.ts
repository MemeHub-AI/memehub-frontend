import { Address, OpenedContract, toNano } from '@ton/core'

import { useInit } from './useInit'
import { useTonClient } from './useTonClient'
import { useConnection } from './useConnection'

import { useTonMainAddress } from '../use-ton-address'
import { Factory } from '@/contract/factory/factory'
import { Bondingcurve } from '@/contract/factory/Bondingcurve'
import {
  buildOnchainMetadata,
  SendCoinsContent,
} from '@/contract/factory/buildOnchain'

export const useContactsWrapper = () => {
  const client = useTonClient()
  const { sender } = useConnection()
  const { factory_address, jetton_mastter_address } = useTonMainAddress()

  // get factory contract
  const mainContract = useInit(async () => {
    const contract = Factory.createFromAddress(Address.parse(factory_address))
    return client?.open(contract) as OpenedContract<Factory>
  }, [client])

  // get bonding curve contract
  const bondingCurve = useInit(async () => {
    const bonding_curve_address = await mainContract?.getBondingCurveAddress(
      Address.parse(jetton_mastter_address)
    )

    if (bonding_curve_address) {
      const contract = Bondingcurve.createFromAddress(bonding_curve_address)
      return client?.open(contract) as OpenedContract<Bondingcurve>
    }
  }, [mainContract])

  // send coins
  const sendCoins = async (content: SendCoinsContent) => {
    const contentCell = buildOnchainMetadata(content)
    await mainContract?.sendDeployJetton(sender, contentCell)
  }

  // buy coins
  const buyCoins = async (amount: number, coinKey: string) => {
    await mainContract?.sendBuyJettonMessage(
      sender,
      Address.parse(coinKey),
      toNano(amount)
    )
  }

  // TON coins are converted to jetton coins
  const getOutJetton = (ton: number) => {
    return bondingCurve?.get_out_jetton(toNano(ton))
  }

  // Jetton coins are converted to ton coins
  const getOutTon = (jetton: number) => {
    return bondingCurve?.get_out_ton(toNano(jetton))
  }

  return {
    sendCoins,
    buyCoins,
    getOutJetton,
    getOutTon,
  }
}
