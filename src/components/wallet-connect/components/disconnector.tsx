import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdLogout } from 'react-icons/md'

import { Button, type ButtonProps } from '../../ui/button'
import { useWallet } from '../hooks/use-wallet'
import { useResponsive } from '@/hooks/use-responsive'
import { AlertDialog } from '../../ui/alert-dialog'

interface Props extends ButtonProps {
  onConfirm?: () => void
}

export const WalletDisconnector = (props: Props) => {
  const { children, onConfirm, ...restProps } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { isConnected, disconnectWallet } = useWallet()
  const { isMobile } = useResponsive()

  if (!isConnected) return <></>

  return (
    <>
      <Button
        variant="ghost"
        shadow="none"
        size={isMobile ? 'icon-sm' : 'default'}
        onClick={() => setOpen(true)}
        className="space-x-2 !px-2 justify-start max-sm:!px-0 w-full"
        {...restProps}
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
        onConfirm={() => {
          onConfirm?.()
          disconnectWallet()
        }}
      />
    </>
  )
}
