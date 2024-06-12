import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/stores/use-wallet-store'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

export const Ids = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  const ids = [
    {
      id: '1',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar1.png',
    },
    {
      id: '2',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar2.png',
    },
    {
      id: '3',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar3.png',
    },
  ]

  const getIdStatus = () => {
    if (!isConnected) {
      return (
        <div className="mt-3 flex items-center">
          <Button onClick={() => setConnectOpen(true)}>
            {t('connect.wallet')}
          </Button>
          <span className="ml-4">{t('check.wallet.airdrop')}</span>
        </div>
      )
    }

    if (false) {
      return (
        <div className="mt-3 flex items-center">
          <img src="/images/no-airdrop.png" alt="" />
          <span>{t('unfortunately')}</span>
        </div>
      )
    }

    return (
      <div className="mt-2 flex gap-4 flex-wrap">
        {ids.map((id, i) => (
          <div className="flex items-center bg-[#CBFF08] rounded-sm overflow-hidden">
            <img src={id.logo} alt="Avatar" className="w-[46px] h-[46px]" />
            <span className="mx-3 text-xl truncate">{id.name}</span>
            <img
              src="/images/check.png"
              alt="Avatar"
              className="w-[46px] h-[46px] p-2"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Fragment>
      <h1 className="text-2xl">{t('my.identity')}</h1>
      {getIdStatus()}
      <div className="mt-4">
        <span className="text-blue-700 cursor-pointer">{t('apply.kol')}</span>
        <span className="ml-2">{t('platform.airdrop')}</span>
      </div>
      <div className="mt-1">
        <span className="text-blue-700 cursor-pointer">
          {t('apply.community')}
        </span>
        <span className="ml-2">{t('community.airdrops')}</span>
      </div>
    </Fragment>
  )
}
