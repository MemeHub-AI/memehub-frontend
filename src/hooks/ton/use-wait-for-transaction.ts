import {
  Address,
  beginCell,
  CommonMessageInfoInternal,
  storeMessage,
  Transaction,
} from '@ton/core'
import { useTonClient } from './contracts/use-ton-client'
import { useEffect, useState } from 'react'
import { TonClient } from '@ton/ton'

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

export const useWaitForTransaction = (options: Options) => {
  const {
    hash: hashBoc,
    address: userFriendlyAddress,
    refetchInterval = 2000,
    refetchLimit = 20,
  } = options
  const client = useTonClient()
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [data, setData] = useState<Transaction>()
  const [error, setError] = useState('')

  useEffect(() => {
    if (userFriendlyAddress === '') return

    getResult()
  }, [userFriendlyAddress, hashBoc])

  const reset = () => {
    setIsPending(false)
    setIsError(false)
    setIsSuccess(false)
    setData(undefined)
  }

  async function findIncomingTransaction(
    client: TonClient,
    transaction: Transaction
  ): Promise<Transaction | null> {
    const inMessage = transaction.inMessage?.info
    if (inMessage?.type !== 'internal') return null
    return client.tryLocateSourceTx(
      inMessage.src,
      inMessage.dest,
      inMessage.createdLt.toString()
    )
  }

  async function findOutgoingTransactions(
    client: TonClient,
    transaction: Transaction
  ): Promise<Transaction[]> {
    const outMessagesInfos = transaction.outMessages
      .values()
      .map((message) => message.info)
      .filter(
        (info): info is CommonMessageInfoInternal => info.type === 'internal'
      )

    return Promise.all(
      outMessagesInfos.map((info) =>
        client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())
      )
    )
  }

  const getResult = () => {
    const walletAddress = Address.parse(userFriendlyAddress)
    setIsPending(true)
    let refetches = 0
    const interval = setInterval(async () => {
      refetches += 1

      const state = await client?.getContractState(walletAddress)
      // console.log('state: ', state)

      if (!state || !state.lastTransaction) {
        // can not find transaction, continue

        return
      }

      const { lt: lastLt, hash: lastHash } = state.lastTransaction
      const lastTx = await client
        ?.getTransactions(walletAddress, {
          limit: 10,
        })
        .then(async (txs) => {
          // console.log('inMessage body[0]: ', txs[0])
          // console.log('inMessage body[1]: ', txs[1])
          console.log('------------------------')

          txs.map(async (item, index) => {
            // console.log(
            //   `findIncomingTransaction[${index}]:`,
            //   await findIncomingTransaction(client, item)
            // )
            console.log('hash data:', item.hash().toString('hex'))

            console.log(
              `findOutgoingTransactions[${index}]:`,
              await findIncomingTransaction(client, item)
            )
          })

          console.log('------------------------')

          // console.log(
          //   'findIncomingTransaction[0]:',
          //   await findIncomingTransaction(client, txs[0])
          // )
          // console.log(
          //   'findIncomingTransaction[1]:',
          //   await findIncomingTransaction(client, txs[1])
          // )
          // console.log(
          //   'findOutgoingTransactions[1]:',
          //   await findOutgoingTransactions(client, txs[1])
          // )
          // console.log(
          //   'findOutgoingTransactions[1]:',
          //   await findOutgoingTransactions(client, txs[1])
          // )
        })

      // if (lastTx && lastTx.inMessage) {
      //   const msgCell = beginCell()
      //     .store(storeMessage(lastTx.inMessage))
      //     .endCell()
      //   const inMsgHash = msgCell.hash().toString('base64')

      //   if (inMsgHash === hashBoc) {
      //     clearInterval(interval)
      //     // success
      //     setIsError(false)
      //     setIsPending(false)
      //     setIsSuccess(true)
      //     setData(lastTx)
      //   }
      // }

      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval)

        // timeout error
        setIsError(true)
        setError('Transaction timeout')
        setIsPending(false)
        setIsSuccess(false)
      }
    }, refetchInterval)
  }

  return {
    data,
    error,
    isSuccess,
    isPending,
    isError,
    reset,
    getResult,
  }
}
