import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDisconnect } from 'wagmi'
import { MdLogout } from 'react-icons/md'

import { reportException } from '@/errors'
import { useLogin } from '@/hooks/use-login'
import { useResponsive } from '@/hooks/use-responsive'
import { useUserStore } from '@/stores/use-user-store'
import { Button } from '../ui/button'
import { AlertDialog } from '../ui/alert-dialog'

export const WalletDisconnector = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { isMobile } = useResponsive()
  const { logout } = useLogin()
  const { setUserInfo } = useUserStore()

  const { disconnect } = useDisconnect({
    mutation: {
      onError: ({ message }) => reportException(message),
      onSuccess: () => {
        logout()
        setUserInfo(null)
      },
    },
  })

  return (
    <>
      <Button
        variant="ghost"
        shadow="none"
        size={isMobile ? 'icon-sm' : 'default'}
        onClick={() => setOpen(true)}
        className="space-x-2 !px-2 justify-start max-sm:!px-0 w-full"
      >
        <MdLogout
          size={18}
          className="ml-[4px] mr-[2px] shrink-0 max-sm:ml-[3px] max-sm:mr-[2px]"
        />
        <span>{t('disconnect')}</span>
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title={t('wallet.disconnect')}
        description={t('wallet.disconnect.confirm')}
        onConfirm={() => disconnect()}
      />
    </>
  )
}
