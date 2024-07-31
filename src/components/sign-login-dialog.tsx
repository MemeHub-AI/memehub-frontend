import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { watchAccount } from 'wagmi/actions'

import { AlertDialog } from './ui/alert-dialog'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { useSignLogin } from '@/hooks/use-sign-login'
import { wagmiConfig } from '@/config/wagmi'

export const SignLoginDialog = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { isConnected } = useAccount()
  const { isLoggingIn, signLogin, logout } = useSignLogin()

  useEffect(() => {
    return watchAccount(wagmiConfig, {
      onChange: ({ address }, { address: prevAddress }) => {
        const isFirst = !!(address && !prevAddress)
        const isChanged = !!(address && prevAddress && address !== prevAddress)

        if (!isConnected) logout()
        if (isFirst || isChanged) setOpen(true)
      },
    })
  }, [isConnected])

  useEffect(() => {
    if (!isConnected) logout()
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
