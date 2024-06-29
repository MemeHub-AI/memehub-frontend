import React, { useState, type ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'

import { WalletAccount } from './components/account'
import { WalletConnector } from './components/connector'
import { useWatchAccount } from './hooks/use-watch-account'
import { useUserStore } from '@/stores/use-user-store'
import { useStorage } from '@/hooks/use-storage'
import { useLogin } from '@/hooks/use-login'
import { AlertDialog } from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface Props extends ComponentProps<'div'> {}

export const WalletConnect = (props: Props) => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { userInfo } = useUserStore()
  const { getToken } = useStorage()
  const { signLogin, logout } = useLogin()
  const [open, setOpen] = useState(false)

  useWatchAccount(() => setOpen(true))

  if (open) {
    return (
      <AlertDialog
        open
        showFooter={false}
        title={t('sign.loading')}
        content={
          <Button
            onClick={() => {
              logout()
              signLogin()
                .then(() => setOpen(false))
                .catch(() => {})
            }}
          >
            {t('sign')}
          </Button>
        }
      />
    )
  }

  return isConnected && userInfo && getToken() ? (
    <WalletAccount />
  ) : (
    <WalletConnector />
  )
}

export default WalletConnect
