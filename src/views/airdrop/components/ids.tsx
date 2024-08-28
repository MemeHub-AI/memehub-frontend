import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import Link from 'next/link'

import { CheckIcon } from '@/components/check-icon'
import { Img } from '@/components/img'
import { CommunityCategory } from '@/api/airdrop/types'
import { useUserStore } from '@/stores/use-user-store'
import { useIsPlayAudio } from '@/stores/use-is-play-audio'
import { utilLang } from '@/utils/lang'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { ConnectWallet } from '@/components/connect-wallet'
import { memehubLinks } from '@/config/link'

export const Ids = () => {
  const { t } = useTranslation()
  const communityMap = {
    [CommunityCategory.Chat]: t('member'),
    [CommunityCategory.Nft]: t('holder'),
    [CommunityCategory.Token]: t('holder'),
  }

  const { isConnected } = useAccount()
  const { isPlayAirdropAudio, setIsPlayAirdropAudio } = useIsPlayAudio()
  const { playRap } = useAudioPlayer()
  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore()

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

    if (!isKol && !hasCommunity) {
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
              src={kolInfo?.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {kolInfo?.name} {t('ambassador')}
            </span>
            <CheckIcon />
          </div>
        )}
        {communityInfo && (
          <div className="flex items-center bg-lime-green rounded-sm overflow-hidden">
            <Img
              src={communityInfo.logo}
              alt="Avatar"
              className="w-11 h-11 rounded-r-none"
            />
            <span className="mx-3 min-w-[50px] text-xl truncate">
              {utilLang.locale(communityInfo.name)}{' '}
              {communityMap[communityInfo.category as CommunityCategory]}
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
            href={memehubLinks.kolForm}
            target="_blank"
            className="text-blue-700 cursor-pointer hover:underline"
          >
            {t('apply.kol')}
          </Link>
          <span className="ml-2">{t('platform.airdrop')}</span>
        </div>
      )}
      {/* TODO: tmep hide */}
      {/* {!hasCommunity && (
        <div className={cn(isKol ? 'mt-4' : 'mt-1')}>
          <Link
            href={formLink.community}
            target="_blank"
            className="text-blue-700 cursor-pointer hover:underline"
          >
            {t('apply.community')}
          </Link>
          <span className="ml-2">{t('community.airdrops')}</span>
        </div>
      )} */}
    </>
  )
}
