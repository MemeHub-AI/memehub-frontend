import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExitIcon } from '@radix-ui/react-icons'

import { Button, type ButtonProps } from '../ui/button'
import { useWallet } from '@/hooks/use-wallet'
import { useResponsive } from '@/hooks/use-responsive'
import { Tooltip } from '../ui/tooltip'
import { AlertDialog } from '../ui/alert-dialog'

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
      <Tooltip
        tip={t('wallet.disconnect.intro')}
        triggerProps={{ asChild: true }}
      >
        <Button
          variant="destructive"
          size={isMobile ? 'icon-sm' : 'icon'}
          onClick={() => setOpen(true)}
          {...restProps}
        >
          {children}
          <ExitIcon />
        </Button>
      </Tooltip>
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
