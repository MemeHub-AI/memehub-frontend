import { useState, type ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { Button } from './ui/button'
import { useResponsive } from '@/hooks/use-responsive'

export const ConnectWallet = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  const { t } = useTranslation()
  const { isConnected, isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isMobile } = useResponsive()
  const [isOpening, setIsOpening] = useState(false)

  return isConnected ? (
    children
  ) : (
    <Button
      size={isMobile ? 'sm' : 'default'}
      disabled={isConnecting}
      type="button"
      onClick={() => openConnectModal?.()}
      {...props}
    >
      {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
    </Button>
  )
}

export default ConnectWallet
