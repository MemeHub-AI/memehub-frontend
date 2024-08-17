import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useResponsive } from '@/hooks/use-responsive'
import { memo, useEffect, useState } from 'react'
import { useAccountEffect } from 'wagmi'
import { chainList, type WalletInfo } from '@/config/wallets'

import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../../ui/button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useStorage } from '@/hooks/use-storage'
import { useWalletsList } from '@/hooks/use-wallets-list'
import { useConnectWallet } from '@/hooks/use-connect-wallet'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useWallet } from '@solana/wallet-adapter-react'
import EvmConnectButton from './evm-wallet-button'
import { WalletsCard } from './wallets-card'

const ChangeChainWallets = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { isConnecting } = useAccount()
  const { isMobile } = useResponsive()
  const [tonConnectUI] = useTonConnectUI()
  const [isOpening, setIsOpening] = useState(false)
  const { setMainChain } = useStorage()
  const { walletLists } = useWalletsList()
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const { connectWallet } = useConnectWallet()
  const [tabsValue, setTabsValue] = useState('wallets')
  const [currentWallet, setCurrentWallet] = useState<WalletInfo>()
  const { connected } = useWallet()

  useEffect(() => {
    if (connected) {
      setMainChain('solana')
    }
  }, [connected])

  // clear monitor
  useEffect(() => {
    const fetchWallets = async () => {
      const fetchedWallets = await walletLists()
      setWallets(fetchedWallets)
    }

    fetchWallets()

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
  const unsubscribe = tonConnectUI.onStatusChange(
    (wallet) => {
      if (wallet !== null) setMainChain('ton')
    },
    (error) => {
      throw new Error(error.message)
    }
  )

  const dialogClose = () => {
    setIsOpening(false)
    setTabsValue('wallets')
    setCurrentWallet(undefined)
  }

  const ChainsListDialog = () => {
    if (!currentWallet) return <></>

    return (
      <div className="flex flex-col space-y-2">
        <EvmConnectButton wallet={currentWallet} showChain />
        <Button
          shadow={null}
          className="w-full"
          onClick={() =>
            connectWallet(currentWallet.chain[1], currentWallet.name)
          }
        >
          <img
            src={chainList[1].image_url}
            alt={'icons'}
            className="w-5 h-5 mr-2"
          />
          {chainList[1].name}
        </Button>
      </div>
    )
  }

  const howToConnect = (wallet: WalletInfo) => {
    if (wallet.chain.length === 1) {
      connectWallet(wallet.chain[0], wallet.name, wallet.bridge_key)
      setIsOpening(false)
      return
    }

    setCurrentWallet(wallet)
    setTabsValue('chains')
  }

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

      <Dialog open={isOpening} onOpenChange={dialogClose}>
        <DialogHeader>
          <DialogTitle className="flex space-x-2 items-center">
            <img src="/images/logo.png" className="w-10 h-10" />
            <img src="/images/logo.svg" className="w-20 h-10" />
          </DialogTitle>
          <DialogDescription>
            <Tabs
              defaultValue="wallets"
              value={tabsValue}
              // onValueChange={(value) => setTabsValue(value)}
            >
              <TabsContent value="wallets">
                {/* wallets list */}
                <WalletsCard
                  howToConnect={(wallet: WalletInfo) => howToConnect(wallet)}
                />
              </TabsContent>
              <TabsContent value="chains">
                {/* chains list */}
                <ChainsListDialog />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </Dialog>
    </>
  )
}

export default memo(ChangeChainWallets)
