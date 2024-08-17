import { WalletButton } from '@rainbow-me/rainbowkit'
import { Button } from '../../ui/button'
import { chainList, WalletInfo } from '@/config/wallets'

const EvmConnectButton: React.FC<{
  wallet: WalletInfo
  showChain?: boolean
}> = ({ wallet, showChain = false }) => {
  return (
    <WalletButton.Custom wallet={wallet.name}>
      {({ ready, connect }) => {
        return (
          <Button
            shadow={null}
            className="w-full"
            disabled={!ready}
            onClick={() => connect()}
          >
            <div className="flex items-center">
              <img
                src={showChain ? chainList[0].image_url : wallet.icon}
                alt={'icons'}
                className="w-5 h-5 mr-2"
              />
              {showChain ? chainList[0].name : wallet.name}
            </div>
          </Button>
        )
      }}
    </WalletButton.Custom>
  )
}

export default EvmConnectButton
