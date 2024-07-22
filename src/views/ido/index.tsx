import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { AvatarCard } from '@/components/avatar-card'
import { TokenSocialLinks } from '@/components/token-links'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIdoInfo } from './hooks/use-ido-info'
import { IdoProvider } from '@/contexts/ido'
import { IdoNotStart } from './components/ido-not-start'
import { IdoStarted } from './components/ido-started'
import { Countdown } from '@/components/countdown'
import { useCheckAccount } from '@/hooks/use-check-chain'

const chainId = 56
const reserveSymbol = 'BNB'
const poolId = 1

export const IdoPage = () => {
  const { t } = useTranslation()
  const idoInfo = useIdoInfo(chainId, poolId)
  const { startAt, endAt } = idoInfo
  const [isExpired, setIsExpired] = useState(false)
  const { isConnected, checkForConnect } = useCheckAccount()

  const [isStarted, duration] = useMemo(
    () => [dayjs(startAt * 1000).diff() <= 0, endAt - startAt],
    [startAt],
  )

  return (
    <IdoProvider
      value={{
        ...idoInfo,
        isExpired,
        chainId,
        reserveSymbol,
        poolId,
      }}
    >
      <main className="bg-orange-500 min-h-body px-3 pt-3 overflow-hidden">
        <AvatarCard
          src="/images/ido/trump.jpeg"
          border="none"
          avatarClass="!border-orange-500"
          className="flex flex-col bg-white rounded max-w-100 mx-auto sm:mt-32 min-h-100"
        >
          <img
            src="/images/ido/fight.jpeg"
            alt="poster"
            className={cn(
              'w-52 absolute -right-24 -bottom-10 z-0 border-4 border-white rounded -rotate-[65deg]',
              'sm:w-52 sm:-right-16 sm:-bottom-12',
            )}
          />

          <h2 className="font-bold text-xl text-center">Trump407</h2>
          <TokenSocialLinks
            x="https://x.com"
            tg="https://t.me"
            website="https://mememhub.ai"
            className="my-1 text-zinc-600"
          />
          <p>{t('ido.405')}</p>

          {isStarted && (
            <Countdown
              className="absolute right-2 top-1 text-yellow-600 text-sm"
              createdAt={startAt}
              duration={duration}
              expiredText={t('ido.ended')}
              onExpired={setIsExpired}
            />
          )}

          {isStarted ? <IdoStarted /> : <IdoNotStart />}

          {!isConnected && (
            <Button
              variant="yellow"
              className="mt-3 w-min"
              size="lg"
              shadow="none"
              type="button"
              onClick={() => checkForConnect()}
            >
              {t('connect')}
            </Button>
          )}

          <Button
            shadow="none"
            variant="warning"
            size="sm"
            className="text-base self-start mt-auto select-none"
          >
            🚀 100x {t('coin')}
          </Button>
        </AvatarCard>
      </main>
    </IdoProvider>
  )
}

export default IdoPage
