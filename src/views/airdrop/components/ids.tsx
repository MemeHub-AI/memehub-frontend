import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import Link from 'next/link'

import { CheckIcon } from '@/components/check-icon'
import { Img } from '@/components/img'
import { CommunityCategory } from '@/api/airdrop/types'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/use-user-store'
import { useIsPlayAudio } from '@/stores/use-is-play-audio'
import { utilLang } from '@/utils/lang'
import { formLink } from '@/config/link'
import { useNftCheck } from '@/hooks/use-nft-check'
import { idoChain } from '@/config/ido'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { ConnectWallet } from '@/components/connect-wallet'

export const Ids = () => {
  const { t } = useTranslation()

  const communityMap = {
    [CommunityCategory.Chat]: t('member'),
    [CommunityCategory.Nft]: t('holder'),
    [CommunityCategory.Token]: t('holder'),
  }
  const { isConnected } = useAccount()
  const { userInfo } = useUserStore()
  // const { ids: { kol } = {} } = useIds()
  const { isPlayAirdropAudio, setIsPlayAirdropAudio } = useIsPlayAudio()
  const { playRap } = useAudioPlayer()

  // TODO: ido temp
  const { isKol, community } = useNftCheck(idoChain.id)

  useEffect(() => {
    if (isPlayAirdropAudio) {
      playRap()
      setIsPlayAirdropAudio(false)
    }
  }, [])

  const getIdStatus = () => {
    if (!isConnected) {
      return (
        <div className="my-3 flex items-center">
          <ConnectWallet />
          <span className="ml-4">{t('check.wallet.airdrop')}</span>
        </div>
      )
    }

    if (!isKol && !community) {
      return (
        <div className="my-3 flex items-center">
          <img src="/images/no-airdrop.png" alt="empty" />
          <span>{t('unfortunately')}</span>
        </div>
      )
    }

    return (
      <div className="my-3 flex gap-4 flex-wrap">
        {isKol && (
          <div className="flex items-center bg-lime-green rounded-sm overflow-hidden">
            <Img
              src={userInfo?.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {userInfo?.name} {t('ambassador')}
            </span>
            <CheckIcon />
          </div>
        )}
        {community && (
          <div className="flex items-center bg-lime-green rounded-sm overflow-hidden">
            <Img
              src={community.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {utilLang.locale(community.name)}{' '}
              {communityMap[community.category as CommunityCategory]}
            </span>
            <CheckIcon />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl">{t('my.identity')}</h1>
      {getIdStatus()}
      {!isKol && (
        <div className="mt-4">
          <Link
            href={formLink.kol}
            target="_blank"
            className="text-blue-700 cursor-pointer"
          >
            {t('apply.kol')}
          </Link>
          <span className="ml-2">{t('platform.airdrop')}</span>
        </div>
      )}
      {!community && (
        <div className={cn(isKol ? 'mt-4' : 'mt-1')}>
          <Link
            href={formLink.community}
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
