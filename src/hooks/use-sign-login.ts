import { useAccount, useSignMessage } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

import { reportException } from '@/errors'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/use-user-store'
import { useLocalStorage } from './use-storage'

export const useSignLogin = () => {
  const { t } = useTranslation()
  const { address, chainId, connector } = useAccount()

  const { setUserInfo } = useUserStore()
  const { setStorage, removeStorage } = useLocalStorage()

  const { isPending, mutateAsync } = useMutation({
    mutationKey: [userApi.login.name],
    mutationFn: userApi.login,
    onMutate: () => toast.loading(t('user.login.loading')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: (e) => reportException(e),
    onSuccess: () => toast.success(t('user.login.success')),
  })

  const { isPending: isSigning, signMessageAsync } = useSignMessage({
    mutation: {
      onMutate: () => toast.loading(t('sign.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: () => toast.error(t('sign.failed')),
    },
  })

  const signLogin = async () => {
    try {
      const timestamp = Date.now().toString()
      const message = await signMessageAsync({
        account: address,
        connector,
        message: `Signin at ${timestamp}`,
      })
      const { data } = await mutateAsync({
        wallet_address: address!,
        chain_id: String(chainId),
        sign: message,
        timestamp,
      })

      setStorage('token', data.token)
      setUserInfo(data.user)
    } catch (e) {
      reportException(e)
      throw e
    }
  }

  const logout = () => {
    setUserInfo(null)
    removeStorage('token')
  }

  return {
    isLoggingIn: isPending || isSigning,
    signLogin,
    logout,
  }
}
