import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/stores/use-wallet-store'
import { CheckIcon } from '@/components/check-icon'
import { Img } from '@/components/img'
import { CommunityCategory } from '@/api/airdrop/types'
import { useUserStore } from '@/stores/use-user-store'
import { airdropApi } from '@/api/airdrop'

const kolHref = ''
const communityHref = ''

export const Ids = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()
  const { setUserIdentity, userInfo } = useUserStore()

  const { data } = useQuery({
    queryKey: [airdropApi.getIdentityList.name, userInfo?.id],
    queryFn: async () => {
      if (userInfo?.id == null) return Promise.reject()

      const { data } = await airdropApi.getIdentityList()
      return data
    },
  })
  const ids = data
  const communityMap = {
    [CommunityCategory.Chat]: t('member'),
    [CommunityCategory.Nft]: t('holder'),
    [CommunityCategory.Token]: t('holder'),
  }

  useEffect(() => {
    if (ids) {
      setUserIdentity(ids)
    }
  }, [ids])

  const getIdStatus = () => {
    if (!isConnected) {
      return (
        <div className="mt-3 flex items-center">
          <Button size="lg" onClick={() => setConnectOpen(true)}>
            {t('connect.wallet')}
          </Button>
          <span className="ml-4">{t('check.wallet.airdrop')}</span>
        </div>
      )
    }

    if (ids?.kol == null && !ids?.community) {
      return (
        <div className="mt-3 flex items-center">
          <img src="/images/no-airdrop.png" alt="empty" />
          <span>{t('unfortunately')}</span>
        </div>
      )
    }

    return (
      <div className="mt-2 flex gap-4 flex-wrap">
        {ids?.kol && (
          <div className="flex items-center bg-lime-green rounded-sm overflow-hidden">
            <Img
              src={ids?.kol?.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {ids?.kol?.name} {t('ambassador')}
            </span>
            <CheckIcon />
          </div>
        )}
        {ids?.community?.map((c, i) => (
          <div
            className="flex items-center bg-lime-green rounded-sm overflow-hidden"
            key={i}
          >
            <Img
              src={c.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {c.name} {communityMap[c.category]}
            </span>
            <CheckIcon />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl">{t('my.identity')}</h1>
      {getIdStatus()}
      <div className="mt-4">
        <Link
          href={kolHref}
          target="_blank"
          className="text-blue-700 cursor-pointer"
        >
          {t('apply.kol')}
        </Link>
        <span className="ml-2">{t('platform.airdrop')}</span>
      </div>
      <div className="mt-1">
        <Link
          href={communityHref}
          target="_blank"
          className="text-blue-700 cursor-pointer"
        >
          {t('apply.community')}
        </Link>
        <span className="ml-2">{t('community.airdrops')}</span>
      </div>
    </>
  )
}
