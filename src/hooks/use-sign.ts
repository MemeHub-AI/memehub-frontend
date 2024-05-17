import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAccount, useSignMessage } from 'wagmi'

export const useSign = () => {
  const { t } = useTranslation()
  const [isSigned, setIsSigned] = useState(false)
  const { address, connector } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const signAsync = async () => {
    const id = toast.loading(t('sign.loading'))

    signMessageAsync({
      account: address,
      connector,
      message: `Signin:${Date.now()}`,
    })
      .then((res) => {
        toast.success(t('sign.success'))
        setIsSigned(true)
        return res
      })
      .catch(() => toast.error(t('sign.failed')))
      .finally(() => toast.dismiss(id))
  }

  return {
    isSigned,
    signAsync,
  }
}
