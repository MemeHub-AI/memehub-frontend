import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/stores/use-wallet-store'
import { CheckIcon } from '@/components/check-icon'
import { Img } from '@/components/img'
import { CommunityCategory } from '@/api/airdrop/types'
import { useIds } from '@/hooks/use-ids'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/use-user-store'

const kolHref = ''
const communityHref = ''

export const Ids = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { userInfo } = useUserStore()
  const { setConnectOpen } = useWalletStore()
  const { ids } = useIds()

  const communityMap = {
    [CommunityCategory.Chat]: t('member'),
    [CommunityCategory.Nft]: t('holder'),
    [CommunityCategory.Token]: t('holder'),
  }

  const getIdStatus = () => {
    if (!isConnected) {
      return (
        <div className="my-3 flex items-center">
          <Button size="lg" onClick={() => setConnectOpen(true)}>
            {t('connect.wallet')}
          </Button>
          <span className="ml-4">{t('check.wallet.airdrop')}</span>
        </div>
      )
    }

    if (ids?.kol == null && !ids?.community) {
      return (
        <div className="my-3 flex items-center">
          <img src="/images/no-airdrop.png" alt="empty" />
          <span>{t('unfortunately')}</span>
        </div>
      )
    }

    return (
      <div className="my-3 flex gap-4 flex-wrap">
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
      <audio autoPlay>
        <source src="/audio/rap-dos-memes.mp3" type="audio/mpeg"/>
      </audio>
      <h1 className="text-2xl">{t('my.identity')}</h1>
      {getIdStatus()}
      {userInfo?.role?.kol ? null : (
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
      )}
      {userInfo?.role?.community ? null : (
        <div className={cn(userInfo?.role?.kol ? 'mt-4' : 'mt-1')}>
          <Link
            href={communityHref}
            target="_blank"
            className="text-blue-700 cursor-pointer"
          >
            {t('apply.community')}
          </Link>
          <span className="ml-2">{t('community.airdrops')}</span>
        </div>
      )}
    </>
  )
}
