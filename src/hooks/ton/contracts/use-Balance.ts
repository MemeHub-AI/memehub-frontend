import { Address } from '@ton/core'
import { useInit } from './use-init'
import { useTonClient } from './use-ton-client'
import { useTonAddress } from '@tonconnect/ui-react'

export const useBalance = () => {
  const client = useTonClient()
  const userFriendlyAddress = useTonAddress()

  // Get the user's wallet balance
  const getBalance = useInit(async () => {
    const balance = await client?.getBalance(Address.parse(userFriendlyAddress))

    return Number(balance) / 1000000000
  }, [userFriendlyAddress])

  return { getBalance }
}