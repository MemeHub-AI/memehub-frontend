import React from 'react'
import { useTranslation } from 'react-i18next'
import { injected } from 'wagmi/connectors'

import { useWallet } from '../hooks/use-wallet'
import { useResponsive } from '@/hooks/use-responsive'
import { Button } from '../../ui/button'
import { Dialog, DialogTitle } from '../../ui/dialog'
import { Avatar } from '../../ui/avatar'
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
        onClick={() =>
          isMobile ? connectWallet(injected()) : setConnectOpen(true)
        }
      >
        {disabled ? t('wallet.connecting') : !isMobile ? t('wallet.connect') : t('connect')}
      </Button>
      <Dialog
        open={connectOpen}
        onOpenChange={(value) => setConnectOpen(value)}
      >
        <DialogTitle>{t('walle.select')}</DialogTitle>
        {/* Exclude `injected` connect */}
        {connectors.slice(1).map((c, i) => (
          <Button
            key={i}
            size="lg"
            variant="outline"
            shadow="none"
            className="flex w-full hover:bg-zinc-100"
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
