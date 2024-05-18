import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { useMutation } from '@tanstack/react-query'
import { first } from 'lodash'

import { useSign } from './use-sign'
import { userApi } from '@/api/user'
import { fmt } from '@/utils/fmt'

export const useWallet = () => {
  const {
    address,
    addresses,
    status,
    chainId,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
  } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()
  const { signAsync } = useSign()

  const { mutateAsync } = useMutation({
    mutationKey: [userApi.new.name],
    mutationFn: userApi.new,
  })

  const login = (addr: string, chainId: number, message: string) => {
    mutateAsync({
      name: fmt.addr(addr),
      logo: 'https://storage.memehub.ai/avater.png',
      description: 'A Meme boy/girl',
      wallet_address: addr,
      chain_id: String(chainId),
      sign: message,
    })
  }

  const connectWallet = async (connector: (typeof connectors)[number]) => {
    try {
      const { accounts, chainId } = await connectAsync({ connector })
      const address = first(accounts)
      const message = await signAsync()

      if (!address?.trim()) throw 'No address'
      login(address, chainId, message)
    } catch (e) {
      console.error(`[connectWallet error]: ${e}`)
      disconnectWallet()
    }
  }

  const disconnectWallet = async () => {
    console.log('disconnect')
    try {
      await disconnectAsync()
    } catch (e) {
      console.error(`[disconnectWallet error] : ${e}`)
    }
  }

  // Auto switch chain when connected.
  useEffect(() => {
    if (status === 'connected') {
      switchChainAsync({ chainId }).catch((e) =>
        console.log(`Switch chain error: ${e}`)
      )
    }
  }, [status])

  return {
    address,
    addresses,
    connectors,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
    connectWallet,
    disconnectWallet,
  }
}
