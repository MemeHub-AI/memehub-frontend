import { useEffect } from 'react'
import { watchAccount, WatchAccountParameters } from '@wagmi/core'

import { wagmiConfig } from '@/config/wagmi'
import { useLogin } from '@/hooks/use-login'

export const useWatchAccount = (
  onAccountChange?: WatchAccountParameters['onChange']
) => {
  const { signLogin, logout } = useLogin()

  const onChange: WatchAccountParameters['onChange'] = (
    account,
    prevAccount
  ) => {
    const { address, chainId } = account
    const { address: prevAddress } = prevAccount

    // First change is connect on mount.
    if (!prevAddress) return

    // Same address, no change.
    if (address === prevAddress) return

    logout()
    signLogin(address, chainId)
  }

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange: (account, prevAccount) => {
        onChange(account, prevAccount)
        onAccountChange?.(account, prevAccount)
      },
    })

    return unwatch
  }, [])

  return {}
}
