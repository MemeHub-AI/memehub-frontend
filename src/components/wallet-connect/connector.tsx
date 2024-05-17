import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWallet } from '@/hooks/use-wallet'
import { useResponsive } from '@/hooks/use-responsive'
import { Button } from '../ui/button'
import { Dialog, DialogTitle } from '../ui/dialog'
import { Avatar } from '../ui/avatar'

export const WalletConnector = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { isConnecting, connectors, connectWallet } = useWallet()
  const { isMobile } = useResponsive()

  const disabled = isConnecting && open

  return (
    <>
      <Button
        disabled={disabled}
        size={isMobile ? 'sm' : 'default'}
        onClick={() => setOpen(true)}
      >
        {disabled ? t('wallet.connecting') : t('wallet.connect')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>{t('walle.select')}</DialogTitle>
        {/* Exclude `injected` connect */}
        {connectors.slice(1).map((c, i) => (
          <Button
            variant="secondary"
            key={i}
            size="lg"
            onClick={() => connectWallet(c)}
          >
            <Avatar
              src={c.icon ?? ''}
              fallback={c.name.charAt(0)}
              size={isMobile ? 22 : 24}
              className="mr-2 rounded-none"
            />
            <span>{c.name}</span>
          </Button>
        ))}
      </Dialog>
    </>
  )
}

export default WalletConnector
