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

export const IdoStarted = () => {
  const { t } = useTranslation()
  const {
    currentReserveAmount,
    totalReserveAmount,
    userAmount,
    userWeight,
    userQuota,
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
            {fmt.decimals(currentReserveAmount, { fixed: 3 })} {reserveSymbol}
          </span>
          <span>
            {fmt.decimals(totalReserveAmount)} {reserveSymbol}
          </span>
        </div>
      </div>

      {isActive && !isExpired && (isKol || community) && <JoinInput />}

      {isActive && isExpired && (
        <div className="font-bold mt-4">
          <p>{t('ido.ended1')}</p>
          <p>{t('ido.ended2')}</p>
        </div>
      )}

      {(isEnded || isCanceled) && <EndedButtons />}

      {!BigNumber(userAmount).isZero() && (
        <div className="mt-3 text-purple-500 font-bold">
          <p>
            {t('ido.participated')} {fmt.decimals(userAmount)} {reserveSymbol} x{' '}
            {userWeight}%
          </p>
          <p>
            <span>{t('ido.obtained')}</span>
            <span className="text-xl mx-1">{fmt.decimals(userQuota)}%</span>
            <span>{t('ido.quota')}</span>
          </p>
        </div>
      )}

      <p className="text-sm text-zinc-500 mt-3">{t('ido.policy1')}</p>
      <p className="text-sm text-zinc-500 my-1">{t('ido.policy2')}</p>
      {isKol && (
        <div className="text-zinc-500 text-sm space-y-1">
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
        <div className="text-zinc-500 text-sm space-y-1">
          <p>
            {t('ido.detect-cmnt')
              .split('$')[0]
              .replace(
                '{}',
                fmt.withCommunity(utilLang.locale(community.name)),
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