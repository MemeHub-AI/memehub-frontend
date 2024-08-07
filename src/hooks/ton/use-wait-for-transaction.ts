import { Address, beginCell, storeMessage } from '@ton/core'
import { useTonClient } from './contracts/use-ton-client'
import { toast } from 'sonner'

interface Options {
  /** boc hash */
  hash: string
  /** wallet address */
  address: string
  /** interval of request */
  refetchInterval?: number
  /** times of request */
  refetchLimit?: number
}

export const useWaitForTransaction = () => {
  const client = useTonClient()

  const getResult = (options: Options) => {
    const { hash, refetchInterval = 3000, refetchLimit = 20, address } = options

    return new Promise((resolve) => {
      let refetches = 0
      const walletAddress = Address.parse(address)
      const interval = setInterval(async () => {
        refetches += 1

        const state = await client?.getContractState(walletAddress)
        if (!state || !state.lastTransaction) {
          clearInterval(interval)
          resolve(null)
          return
        }

        const { lt: lastLt, hash: lastHash } = state.lastTransaction
        const lastTx = await client?.getTransaction(
          walletAddress,
          lastLt,
          lastHash
        )

        if (lastTx && lastTx.inMessage) {
          const msgCell = beginCell()
            .store(storeMessage(lastTx.inMessage))
            .endCell()
          const inMsgHash = msgCell.hash().toString('base64')
          console.log('InMsgHash', inMsgHash)
          console.log('hash:', hash)

          if (inMsgHash === hash) {
            clearInterval(interval)
            resolve(lastTx)
            toast.success('Success!!')
          }
        }

        if (refetchLimit && refetches >= refetchLimit) {
          clearInterval(interval)
          resolve(null)
          toast.error('Transaction timeout')
        }
      }, refetchInterval)
    })
  }

  return { getResult }
}
