import { Address, beginCell, storeMessage, Transaction } from '@ton/core'
import { useTonClient } from './contracts/use-ton-client'
import { useEffect, useState } from 'react'
import { useHttpClient } from './use-http-client'
import { Trace } from 'tonapi-sdk-js'
import { CONTEXT_ERR } from '@/errors/context'

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
  const [data, setData] = useState('')
  const [error, setError] = useState({ message: '' })
  const { getTraceApi } = useHttpClient()

  useEffect(() => {
    if (userFriendlyAddress === '') return

    getResult()
  }, [userFriendlyAddress, hashBoc])

  const reset = () => {
    setIsPending(false)
    setIsError(false)
    setIsSuccess(false)
    setError({ message: '' })
    setData('')
  }

  const getJttonAddress = async (hash: string) => {
    // await getTraceApi(hash)
    const trace = await getTraceApi(hash)

    console.log('trace:', trace)

    if (!trace.transaction.success) {
      return false
    }

    // if (!trace.children) {
    //   await new Promise((resolve) => setTimeout(resolve, 10000))
    //   return await getJttonAddress(hash)
    // }

    if (trace.transaction.success && trace.children) {
      return TraceChildrenIsSucess(trace.children)
    }
  }

  const TraceChildrenIsSucess = (children: Trace[]) => {
    const result = children.every((item) => {
      // console.log('22222222222222222')
      if (item.interfaces[0] === 'jetton_wallet') {
        // console.log(11111111111111)

        setData(item.transaction.account.address)
      }

      if (!item.transaction.success) {
        return false
      }

      // recursion
      if (item.children !== undefined) {
        if (!TraceChildrenIsSucess(item.children)) {
          return false
        }
      }

      return true
    })

    return result
  }

  const getResult = () => {
    const walletAddress = Address.parse(userFriendlyAddress)
    setIsPending(true)
    let refetches = 0
    const interval = setInterval(async () => {
      refetches += 1

      console.log(
        await getJttonAddress(
          'd458125e20bfdbcb944b18721452532e65ec565db8e692a9a8d17cd6f694faa6'
        )
      )

      // const state = await client?.getContractState(walletAddress)
      // if (!state || !state.lastTransaction) {
      //   // can not find transaction, continue

      //   return
      // }

      // const { lt: lastLt, hash: lastHash } = state.lastTransaction
      // const lastTx = await client?.getTransaction(
      //   walletAddress,
      //   lastLt,
      //   lastHash
      // )

      // if (lastTx && lastTx.inMessage) {
      //   const msgCell = beginCell()
      //     .store(storeMessage(lastTx.inMessage))
      //     .endCell()
      //   const inMsgHash = msgCell.hash().toString('base64')

      //   if (inMsgHash === hashBoc) {
      //     clearInterval(interval)
      //     if (await getJttonAddress(lastTx.hash().toString('hex'))) {
      //       // success
      //       setIsError(false)
      //       setIsPending(false)
      //       setIsSuccess(true)
      //     } else {
      //       // error
      //       setIsError(true)
      //       setError({ message: 'Transaction error' })
      //       setIsPending(false)
      //       setIsSuccess(false)
      //     }
      //   }
      // }

      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval)

        // timeout error
        setIsError(true)
        setError({ message: 'Transaction not found' })
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
