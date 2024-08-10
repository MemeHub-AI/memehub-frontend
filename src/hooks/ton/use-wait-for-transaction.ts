import { Address, beginCell, storeMessage, Transaction } from '@ton/core'
import { useTonClient } from './contracts/use-ton-client'
import { useEffect, useState } from 'react'

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
    if (userFriendlyAddress === '' || hashBoc === '') return

    getResult()
  }, [userFriendlyAddress, hashBoc])

  const reset = () => {
    setIsPending(false)
    setIsError(false)
    setIsSuccess(false)
    setData(undefined)
  }

  const getResult = () => {
    const walletAddress = Address.parse(userFriendlyAddress)
    setIsPending(true)
    let refetches = 0
    const interval = setInterval(async () => {
      refetches += 1

      const state = await client?.getContractState(walletAddress)
      if (!state || !state.lastTransaction) {
        // can not find transaction, continue

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

        if (inMsgHash === hashBoc) {
          clearInterval(interval)
          // success
          setIsError(false)
          setIsPending(false)
          setIsSuccess(true)
          setData(lastTx)
        }
      }

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
