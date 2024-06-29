import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useSignMessage } from 'wagmi'

export const useSign = () => {
  const { t } = useTranslation()
  const [isSigned, setIsSigned] = useState(false)
  const { address, connector } = useAccount()

  const { signMessageAsync } = useSignMessage({
    mutation: {
      onMutate: () => toast.loading(t('sign.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: () => toast.error(t('sign.failed')),
      onSuccess: () => setIsSigned(true),
    },
  })

  const signAsync = async (salt = '') => {
    return signMessageAsync({
      account: address as Address,
      connector,
      message: `Signin at ${salt}`,
    })
  }

  return {
    isSigned,
    signAsync,
  }
}
