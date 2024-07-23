import { useAccount } from 'wagmi'
import { Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { useSign } from './use-sign'
import { useUser } from './use-user'
import { useStorage } from './use-storage'
import { useWalletStore } from '@/stores/use-wallet-store'
import { reportException } from '@/errors'

export const useLogin = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected } = useAccount()
  const { isSigning, signAsync } = useSign()
  const { isLoggingIn, login, logout } = useUser()
  const { getToken } = useStorage()
  const { setConnectOpen } = useWalletStore()

  const signLogin = async (
    overrideAddr?: Address,
    overrideChainId?: number
  ) => {
    const timestamp = Date.now().toString()
    try {
      const message = await signAsync(timestamp)

      if (!overrideAddr && !address) {
        toast.error(t('login.addr.empty'))
        return
      }

      if (!overrideChainId && !chainId) {
        toast.error(t('login.chain.empty'))
        return
      }

      return login({
        wallet_address: (overrideAddr || address) as Address,
        chain_id: String(overrideChainId || chainId),
        sign: message,
        timestamp,
      })
    } catch (e) {
      reportException(e)
      throw e
    }
  }

  const checkForLogin = () => {
    if (!isConnected || isEmpty(getToken())) {
      setConnectOpen(true)
      return false
    }
    return true
  }

  return {
    isLoggingIn: isLoggingIn || isSigning,
    signLogin,
    logout,
    checkForLogin,
  }
}
