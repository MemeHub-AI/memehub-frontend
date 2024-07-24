import React from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Progress } from '@/components/ui/progress'
import { fmt } from '@/utils/fmt'
import { useIdoContext } from '@/contexts/ido'
import { useIdoCheck } from '../hooks/use-ido-check'
import { useUserStore } from '@/stores/use-user-store'
import { JoinInput } from './join-input'
import { EndedButtons } from './ended-buttons'
import { utilLang } from '@/utils/lang'
import { ParticipatedTips } from './participated-tips'

export const IdoStarted = () => {
  const { t } = useTranslation()
  const {
    raisedReserveAmount,
    totalReserveAmount,
    userAmount,
    userWeight,
    isCommunityMember,
    isActive,
    isEnded,
    isCanceled,
    isExpired,
    reserveSymbol,
    progress,
  } = useIdoContext()
  const { isKol, community } = useIdoCheck()
  const { userInfo } = useUserStore()

  return (
    <div className="mb-3 z-10">
      <div className="w-full">
        <Progress
          className="h-5 mt-3 rounded"
          indicatorClass="bg-green-500"
          value={progress}
        />
        <div className="flex items-center justify-between">
          <span>
            {fmt.decimals(raisedReserveAmount, { fixed: 3 })} {reserveSymbol}
          </span>
          <span>
            {fmt.decimals(totalReserveAmount)} {reserveSymbol}
          </span>
        </div>
      </div>

      {isActive && !isExpired && (isKol || isCommunityMember) && <JoinInput />}

      {isExpired && !isEnded && <EndedButtons onlyRefund />}

      {isActive && isExpired && (
        <div className="font-bold mt-4">
          <p>{t('ido.ended1')}</p>
          <p>{t('ido.ended2')}</p>
        </div>
      )}

      {(isEnded || isCanceled) && <EndedButtons />}

      {!BigNumber(userAmount).isZero() && <ParticipatedTips />}

      <p className="text-sm text-zinc-500 mt-3 w-5/6">
        {utilLang.replace(t('ido.policy1'), [
          `${totalReserveAmount} ${reserveSymbol}`,
        ])}
      </p>
      <p className="text-sm text-zinc-500 my-1 w-5/6">{t('ido.policy2')}</p>

      {isKol && (
        <div className="text-zinc-500 text-sm space-y-1 w-5/6">
          <p>
            {t('ido.detect-kol')
              .split('$')[0]
              .replace('{}', userInfo?.name ?? '')}
          </p>
          <p>
            {t('ido.detect-kol').split('$')[1].replace('{}', `${userWeight}%`)}
          </p>
        </div>
      )}
      {!isKol && community && (
        <div className="text-zinc-500 text-sm space-y-1 w-5/6">
          <p>
            {t('ido.detect-cmnt')
              .split('$')[0]
              .replace(
                '{}',
                fmt.withCommunity(utilLang.locale(community.name))
              )}
          </p>
          <p>
            {t('ido.detect-cmnt').split('$')[1].replace('{}', `${userWeight}%`)}
          </p>
        </div>
      )}
    </div>
  )
}

export default IdoStarted
