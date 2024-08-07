import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { Cell, Sender, SenderArguments } from '@ton/core'
import { useWaitForTransaction } from '../use-wait-for-transaction'

interface Interval {
  /** interval of request */
  refetchInterval?: number
  /** times of request */
  refetchLimit?: number
}

export function useConnection(interval?: Interval): {
  sender: Sender
  connected: boolean
} {
  const [TonConnectUI] = useTonConnectUI()
  const { getResult } = useWaitForTransaction()
  const userFriendlyAddress = useTonAddress()
  // const getTimestamp = () => {
  //   const timestamp = Date.now()
  //   return timestamp
  // }

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

        // Track transaction status
        const codeCell = Cell.fromBoc(Buffer.from(res.boc, 'base64'))[0]
        const options = {
          hash: codeCell.hash().toString('base64'),
          address: userFriendlyAddress,
          refetchInterval: interval?.refetchInterval,
          refetchLimit: interval?.refetchLimit,
        }
        getResult(options)
      },
    },
    connected: TonConnectUI.connected,
  }
}
