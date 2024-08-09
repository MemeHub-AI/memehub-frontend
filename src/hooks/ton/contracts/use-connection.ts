import { useTonConnectUI } from '@tonconnect/ui-react'
import { Cell, Sender, SenderArguments } from '@ton/core'
import { useTonBocStore } from '@/stores/use-ton-boc-store'

export function useConnection(): {
  sender: Sender
  connected: boolean
} {
  const [TonConnectUI] = useTonConnectUI()
  const { setHashBoc } = useTonBocStore()

  return {
    sender: {
      send: async (args: SenderArguments) => {
        const res = await TonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now(),
        })
        const codeCell = Cell.fromBoc(Buffer.from(res.boc, 'base64'))[0]
        setHashBoc(codeCell.hash().toString('base64'))
      },
    },
    connected: TonConnectUI.connected,
  }
}
