import { useEffect } from 'react'
import { watchAccount, WatchAccountParameters } from 'wagmi/actions'
import { Address } from 'viem'

import { wagmiConfig } from '@/config/wagmi'

export const useWatchAccount = (
  onAccountChange?: (addr: Address, prevAddr: Address) => void
) => {
  const onChange: WatchAccountParameters['onChange'] = (
    { address },
    { address: prevAddress }
  ) => {
    if (!prevAddress || !address) return
    if (address === prevAddress) return

    onAccountChange?.(address, prevAddress)
  }

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange,
    })

    return unwatch
  }, [])

  return {}
}
