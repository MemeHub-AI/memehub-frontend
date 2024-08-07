import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useResponsive } from '@/hooks/use-responsive'

import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useTonConnectModal } from '@tonconnect/ui-react'
import { useState } from 'react'

export const ChangeChainWallets = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isMobile } = useResponsive()
  const { open } = useTonConnectModal() // Ton connect wallet API

  const [isOpening, setIsOpening] = useState(false)

  const chainList = [
    {
      name: 'Ethereum',
      image_url: 'https://storage.memehub.ai/chains/logo/ethereum.png',
      connect_wallet: openConnectModal,
    },
    {
      name: 'Solana',
      image_url: 'https://storage.memehub.ai/chains/logo/solana.png',
      connect_wallet: openConnectModal,
    },
    {
      name: 'Ton',
      image_url: 'https://storage.memehub.ai/chains/logo/ton.png',
      connect_wallet: open,
    },
  ]

  return (
    <>
      <Button
        className={className}
        size={isMobile ? 'sm' : 'default'}
        disabled={isConnecting}
        type="button"
        onClick={() => setIsOpening(true)}
      >
        {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
      </Button>
      <Dialog open={isOpening} onOpenChange={setIsOpening}>
        <DialogHeader>
          <DialogTitle>{t('decide.chains')}</DialogTitle>
          <DialogDescription className="flex flex-col space-y-2">
            {chainList.map((chain, index) => (
              <Button
                key={index}
                shadow={null}
                className="w-full"
                onClick={() => {
                  setIsOpening(false)
                  chain['connect_wallet']!()
                }}
              >
                <img
                  src={chain.image_url}
                  alt={'icons'}
                  className="w-5 h-5 mr-2"
                />
                {chain.name}
              </Button>
            ))}
          </DialogDescription>
        </DialogHeader>
      </Dialog>
    </>
  )
}
