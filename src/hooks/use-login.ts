import { useAccount } from 'wagmi'
import { Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { useSign } from './use-sign'
import { useUser } from './use-user'

export const useLogin = () => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const { signAsync } = useSign()
  const { login, logout } = useUser()

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
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return {
    signLogin,
    logout,
  }
}
