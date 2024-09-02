import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { watchAccount } from 'wagmi/actions'
import { useTranslation } from 'react-i18next'

import { AlertDialog } from './ui/alert-dialog'
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

        console.log('sign', {
          isConnected,
          isFirst,
          isChanged,
          isAutoConnect,
          hasToken,
        })

        // logout if disconnect.
        if (!isConnected || isChanged) logout()

        // First connect or change account, sign.
        if (isFirst || isChanged) {
          setOpen(true)
          return
        }

        // Latest connected, but not token, re-sign.
        if (isAutoConnect && !isConnected && !hasToken) {
          logout()
          disconnect()
          setOpen(false)
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
