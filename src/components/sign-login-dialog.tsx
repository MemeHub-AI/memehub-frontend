import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { watchAccount } from 'wagmi/actions'

import { AlertDialog } from './ui/alert-dialog'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { useSignLogin } from '@/hooks/use-sign-login'
import { wagmiConfig } from '@/config/wagmi'
import { useLocalStorage } from '@/hooks/use-storage'

export const SignLoginDialog = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { isLoggingIn, signLogin, logout } = useSignLogin()
  const { getStorage } = useLocalStorage()

  useEffect(() => {
    return watchAccount(wagmiConfig, {
      onChange: ({ address }, { address: prevAddress }) => {
        const isFirst = !!(address && !prevAddress)
        const isChanged = !!(address && prevAddress && address !== prevAddress)
        const isAutoConnect = !!address && !!prevAddress && isConnected
        const hasToken = !!getStorage('token')

        // logout if disconnect.
        if (!isConnected) logout()

        // First connect or change account, sign.
        if (isFirst || isChanged) {
          logout()
          setOpen(true)
          return
        }

        // Latest connected, but not token, re-sign.
        if (isAutoConnect && !hasToken) {
          logout()
          // disconnect()
          return
        }
      },
    })
  }, [isConnected])

  return (
    <>
      <AlertDialog
        open={open}
        showFooter={false}
        align="center"
        title={t('sign.login')}
        content={
          <Button
            disabled={isLoggingIn}
            onClick={() => signLogin().then(() => setOpen(false))}
          >
            {isLoggingIn ? t('signing') : t('sign')}
          </Button>
        }
      />
    </>
  )
}

export default SignLoginDialog
