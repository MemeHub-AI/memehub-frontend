import { type ComponentProps, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@solana/wallet-adapter-react'

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

export const ConnectSolWallet = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  const { t } = useTranslation()
  const { wallet, wallets, connected, connecting, select } = useWallet()

  // Connect is wallet selected.
  useEffect(() => {
    if (!wallet?.adapter.connected) {
      wallet?.adapter?.connect()
    }
  }, [wallet])

  if (connected) return children

  // TODO/top: should use `WalletConnect` v2, it's supports solana wallet.
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" {...props}>
          {connecting ? t('wallet.connecting') : t('wallet.connect')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {wallets.map(({ adapter, readyState }) => (
          <Button
            type="button"
            className="space-x-2"
            onClick={() => select(adapter.name)}
          >
            <img src={adapter.icon} alt="logo" className="w-6 h-6" />
            <span>{adapter.name}</span>
            <span className="text-zinc-500 text-xs">{readyState}</span>
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default ConnectSolWallet
