import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWallet } from '@/hooks/use-wallet'
import { useResponsive } from '@/hooks/use-responsive'
import { Button } from '../ui/button'
import { Dialog, DialogTitle } from '../ui/dialog'
import { Avatar } from '../ui/avatar'
import { useWalletStore } from '@/stores/use-wallet-store'

export const WalletConnector = () => {
  const { connectOpen, setConnectOpen } = useWalletStore()
  const { t } = useTranslation()
  const { isConnecting, connectors, connectWallet } = useWallet()
  const { isMobile } = useResponsive()

  const disabled = isConnecting && connectOpen

  return (
    <>
      <Button
        disabled={disabled}
        size={isMobile ? 'sm' : 'default'}
        onClick={() => setConnectOpen(true)}
      >
        {disabled ? t('wallet.connecting') : t('wallet.connect')}
      </Button>
      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
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
