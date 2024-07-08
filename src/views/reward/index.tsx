import React from 'react'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { RewardRules } from './components/reward-rules'
import { DiamondIcon } from '@/components/diamond-icon'
import { UserIcon } from '@/components/user-icon'
import { useClipboard } from '@/hooks/use-clipboard'
import { InviteReward } from './components/invite-reward'
import { InviteTable } from './components/invite-table'
import { useUserStore } from '@/stores/use-user-store'
import { PrimaryLayout } from '@/components/layouts/primary'
import { INVITE_REWARD } from '@/constants/invite'
import { useWalletStore } from '@/stores/use-wallet-store'
import { cn } from '@/lib/utils'

export const RewardPage = () => {
  const { t } = useTranslation()
  const { isCopied, copy } = useClipboard()
  const { userInfo } = useUserStore()
  const link = `${window.location.origin}?r=${userInfo?.code || ''}`

  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  return (
    <PrimaryLayout container="div" className="my-4">
      <h2 className="font-bold text-2xl mb-2">{t('reward.title')}</h2>
      {/* Descriptions */}
      <div className="">
        <p>{t('reward.desc1')}</p>
        <p className="leading-9">
          {t('reward.invite-desc').split('$')[0]}
          <span className="text-blue-600 font-bold text-xl">
            {INVITE_REWARD}%
          </span>
          {t('reward.invite-desc').split('$')[1]}
        </p>
      </div>

      {/* Diamond / invite count / invite link */}
      <div className="flex items-stretch gap-4 xl:gap-8 mt-2 flex-wrap">
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-lg">{t('reward.diamond-reward')}</h3>
          <div className="flex items-center space-x-2">
            <DiamondIcon size={36} />
            <p className="text-blue-600 text-2xl font-bold">
              {BigNumber(userInfo?.reward_amount || 0).toFormat()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-lg">
            {t('reward.direct-invite-count')}
          </h3>
          <div className="flex items-center space-x-2">
            <UserIcon size={36} />
            <p className="text-blue-600 text-2xl font-bold">
              {BigNumber(userInfo?.inviter_count.one ?? 0).toFormat()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-lg">
            {t('reward.indirect-invite-count')}
          </h3>
          <div className="flex items-center space-x-2">
            <UserIcon type="user2" size={38} />
            <p className="text-blue-600 text-2xl font-bold">
              {BigNumber(userInfo?.inviter_count.two ?? 0).toFormat()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-lg">{t('reward.invite-friends')}</h3>
          <div
            className={cn(
              'border-2 border-black rounded py-1 px-2 mt-1 flex items-center gap-3',
              !isConnected && 'justify-between'
            )}
          >
            {isConnected ? (
              <Link
                href={link}
                target="_blank"
                className="text-blue-600 hover:underline line-clamp-1"
              >
                {link}
              </Link>
            ) : (
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setConnectOpen(true)}
              >
                {t('wallet.connect')}
              </span>
            )}
            <div
              className="border-2 border-black rounded py-0.5 px-3 cursor-pointer hover:bg-zinc-100"
              onClick={() => {
                if (isConnected) {
                  copy(link)
                  return
                }
                setConnectOpen(true)
              }}
            >
              {isCopied ? (
                <CheckIcon className="mx-2.5" />
              ) : (
                t('copy').toUpperCase()
              )}
            </div>
          </div>
        </div>
      </div>

      <InviteReward className="mt-8" />
      <InviteTable className="mt-8" />
      <RewardRules className="mt-8" />
    </PrimaryLayout>
  )
}

export default RewardPage
