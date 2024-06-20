import React from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'

import { RewardRules } from './reward-rules'
import { DiamondIcon } from '@/components/diamond-icon'
import { UserIcon } from '@/components/user-icon'
import { INVITE_LINK } from '@/config/link'
import { useClipboard } from '@/hooks/use-clipboard'
import { InviteReward } from './invite-reward'
import { InviteTable } from './invite-table'
import { rewardApi } from '@/api/reward'
import { useQuery } from '@tanstack/react-query'
import { useUserStore } from '@/stores/use-user-store'

const diamond = 123

export const RewardFullPage = () => {
  const { t } = useTranslation()
  const { isCopied, copy } = useClipboard()
  const { userInfo } = useUserStore()

  const { data: inviteCode } = useQuery({
    queryKey: [rewardApi.getInviteCode.name],
    queryFn: rewardApi.getInviteCode,
  })

  const { data: inviteCount } = useQuery({
    queryKey: [rewardApi.getInvCount.name],
    queryFn: rewardApi.getInvCount,
  })

  const link = INVITE_LINK + inviteCode?.data

  return (
    <>
      <h2 className="font-bold text-xl">{t('reward.diamond')}</h2>
      <div className="mt-3">
        <p>{t('reward.desc1')}</p>
        <p>{t('reward.desc2')}</p>
      </div>

      <div className="flex items-stretch gap-8 !mt-6">
        <div className="flex flex-col justify-between">
          <h3 className="font-bold">{t('reward.diamond-reward')}</h3>
          <div className="flex items-center gap-2">
            <DiamondIcon />
            <p className="text-blue-600 text-xl font-bold">
              {BigNumber(userInfo?.reward_amount || 0).toFormat()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-bold">{t('reward.invite-count')}</h3>
          <div className="flex items-center gap-2">
            <UserIcon />
            <p className="text-blue-600 text-xl font-bold">
              {BigNumber(inviteCount?.data.count || 0).toFormat()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-bold">{t('reward.invite-friends')}</h3>
          <div className="border-2 border-black rounded py-1 px-2 mt-1 flex items-center gap-3">
            <Link
              href={link}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {link}
            </Link>
            <div
              className="border-2 border-black rounded py-0.5 px-3 cursor-pointer hover:bg-zinc-100"
              onClick={() => copy(link)}
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

      <InviteReward />
      <InviteTable />

      <RewardRules />
    </>
  )
}

export default RewardFullPage
