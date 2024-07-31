import React, { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { watchAccount } from 'wagmi/actions'

import { useStorage } from '@/hooks/use-storage'
import { useLogin } from '@/hooks/use-login'
import { AlertDialog } from './ui/alert-dialog'
import { Button } from './ui/button'
import { useResponsive } from '@/hooks/use-responsive'
import { wagmiConfig } from '@/config/wagmi'

export const ConnectWallet = ({
  children,
  className,
}: ComponentProps<typeof Button>) => {
  const { t } = useTranslation()
  const { isConnected, isConnecting } = useAccount()
  const { getToken, setToken } = useStorage()
  const { isLoggingIn, signLogin, logout } = useLogin()
  const [open, setOpen] = useState(false)
  const { isMobile } = useResponsive()
  const { openConnectModal } = useConnectModal()

  const token = getToken()

  useEffect(() => {
    return watchAccount(wagmiConfig, {
      onChange: ({ address }, { address: prevAddress }) => {
        const isFirst = !!(address && !prevAddress)
        const isChanged = !!(address && prevAddress && address !== prevAddress)

        if (!isFirst && !isChanged) setToken('')
        if (isFirst && getToken()) return
        if (isFirst || isChanged) setToken('')
      },
    })
  }, [])

  useEffect(() => {
    console.log('sign', isConnected, token)
    if (isConnected && !token) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [isConnected, token])

  return (
    <>
      {isConnected ? (
        children
      ) : (
        <Button
          className={className}
          size={isMobile ? 'sm' : 'default'}
          disabled={isConnecting}
          onClick={() => openConnectModal?.()}
        >
          {t('wallet.connect')}
        </Button>
      )}
      <AlertDialog
        open={open}
        showFooter={false}
        title={t('sign.loading')}
        content={
          <Button
            disabled={isLoggingIn}
            onClick={() => {
              logout()
              signLogin()
                .then(() => setOpen(false))
                .catch(() => {})
            }}
          >
            {isLoggingIn ? t('signing') : t('sign')}
          </Button>
        }
      />
    </>
  )
}

export default ConnectWallet
