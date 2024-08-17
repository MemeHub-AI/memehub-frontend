import { supportWallets, WalletInfo } from '@/config/wallets'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { useWallet } from '@solana/wallet-adapter-react'
import { TonConnectUI } from '@tonconnect/ui-react'
import { useConnect } from 'wagmi'

export const useWalletsList = () => {
  const { wallets: solWallets } = useWallet()
  const { connectors } = useConnect()

  console.log('wagmi connectors: ', connectors)

  const multicChainWellts = [
    'Phantom',
    'OKX Wallet',
    'Magic Eden',
    'Coinbase Wallet',
  ]

  const recommendWallets = ['MetaMask', 'Phantom', 'Tonkeeper']

  const getEvmWalletsList = async (): Promise<WalletInfo[]> => {
    const EvmWalletsList = getDefaultWallets().wallets.map(({ wallets }) =>
      wallets.map((fn) => {
        return fn({
          appName: 'Memehub',
          projectId: '72584dc758deda964e371db486be5a0c',
        })
      })
    )

    console.log('EvmWalletsList: ', EvmWalletsList)

    const getEvmWallets = await Promise.all(
      EvmWalletsList[0].map(async (item) => {
        return {
          name: item.name,
          icon:
            typeof item.iconUrl === 'string'
              ? item.iconUrl
              : await item.iconUrl(),
          installed: !!item.installed,
          chain: ['evm'],
          bridge_key: item.id,
          recommend: recommendWallets.includes(item.name),
        }
      })
    )

    console.log('EvmWalletsList: ', EvmWalletsList)

    return getEvmWallets
  }

  const getSolanaWalletsList: WalletInfo[] = solWallets.map((item) => {
    return {
      name: item.adapter.name,
      icon: item.adapter.icon,
      installed: item.readyState === 'Installed' ? true : false,
      chain: ['svm'],
      recommend: recommendWallets.includes(item.adapter.name),
    }
  })

  const getTonWalletsList = async (): Promise<WalletInfo[]> => {
    const tonWallets = await TonConnectUI.getWallets()

    return tonWallets.map<WalletInfo>((wallet) => {
      const { name, imageUrl } = wallet

      if ('injected' in wallet) {
        return {
          name,
          icon: imageUrl,
          installed: wallet.injected,
          chain: ['tvm'],
          bridge_key: wallet.jsBridgeKey,
          recommend: recommendWallets.includes(wallet.name),
        }
      } else {
        return {
          name,
          icon: imageUrl,
          installed: false,
          chain: ['tvm'],
          hidden: true,
          recommend: recommendWallets.includes(wallet.name),
        }
      }
    })
  }

  const walletLists = async (): Promise<WalletInfo[]> => {
    const allWallets = await Promise.all([
      ...(await getEvmWalletsList()),
      ...getSolanaWalletsList,
      ...(await getTonWalletsList()),
    ])

    // fliter
    const filterWallets = allWallets.filter((item) => {
      // reject uninstalled wallets
      if (!item.hidden && supportWallets.includes(item.name)) {
        // add multichain wallets
        if (multicChainWellts.includes(item.name)) item.chain = ['evm', 'svm']

        return item
      }
    })

    console.log('filterWallets: ', filterWallets)

    return filterWallets
  }

  return {
    getEvmWalletsList,
    getSolanaWalletsList,
    getTonWalletsList,
    walletLists,
  }
}
