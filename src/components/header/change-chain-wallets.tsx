import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useResponsive } from '@/hooks/use-responsive'
import { useEffect, useState } from 'react'
import { useAccountEffect } from 'wagmi'

import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useTonConnectModal, useTonConnectUI } from '@tonconnect/ui-react'
import { useStorage } from '@/hooks/use-storage'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'

export const ChangeChainWallets = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isMobile } = useResponsive()
  const { open } = useTonConnectModal() // Ton connect wallet API
  const [tonConnectUI] = useTonConnectUI()
  const [isOpening, setIsOpening] = useState(false)
  const { setMainChain } = useStorage()

  const { setVisible } = useWalletModal()
  const { buttonState } = useWalletMultiButton({
    onSelectWallet() {},
  })
  if (buttonState === 'connecting') {
    setMainChain('solana')
  }

  // clear monitor
  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [])

  // EVM monitor connection
  useAccountEffect({
    onConnect() {
      setMainChain('evm')
    },
  })

  // Ton monitor connection
  const unsubscribe = tonConnectUI.onStatusChange(() => {
    setMainChain('ton')
  })

  const chainList = [
    {
      name: 'Ethereum',
      image_url: 'https://storage.memehub.ai/chains/logo/ethereum.png',
      connect_wallet: openConnectModal,
    },
    {
      name: 'Solana',
      image_url: 'https://storage.memehub.ai/chains/logo/solana.png',
      connect_wallet: () => {
        setVisible(true)
      },
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
