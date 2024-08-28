import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { AvatarCard } from '@/components/avatar-card'
import { SocialLinks } from '@/components/social-links'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIdoInfo } from './hooks/use-ido-info'
import { IdoProvider } from '@/contexts/ido'
import { IdoNotStart } from './components/ido-not-start'
import { IdoStarted } from './components/ido-started'
import { Countdown } from '@/components/countdown'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useRouter } from 'next/router'
import { IdoTag } from '@/components/ido-tag'
import { trumpLinks } from '@/config/link'
import { IdoIntro } from './components/ido-intro'

export const IdoPage = () => {
  const { t } = useTranslation()
  const [isExpired, setIsExpired] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const { isConnected, checkForConnect } = useCheckAccount()
  const { query } = useRouter()

  const poolId = Number(query.id || 0)
  const chainId = 56
  const reserveSymbol = 'BNB'

  const idoInfo = useIdoInfo(chainId, poolId)
  const { startAt, endAt, status } = idoInfo

  const [isStarted, duration] = useMemo(
    () => [dayjs.unix(startAt).diff() <= 0, endAt - startAt],
    [startAt, isStart]
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
      <main className="bg-orange-500 min-h-body pt-3 overflow-hidden">
        <AvatarCard
          src="/images/ido/trump.jpeg"
          border="none"
          avatarClass="!border-orange-500"
          className={cn(
            'flex flex-col bg-white rounded max-w-100 mx-auto sm:mt-32',
            'min-h-100 sm:max-w-md max-sm:mx-3'
          )}
        >
          <img
            src="/images/ido/fight.jpeg"
            alt="poster"
            className={cn(
              'w-52 absolute -right-[5.25rem] -bottom-10 z-0 border-4 border-white rounded -rotate-[65deg]',
              'sm:w-52 sm:-right-16 sm:-bottom-12 select-none'
            )}
          />

          <h2 className="font-bold text-xl text-center">Trump407</h2>
          <p className="text-center">{t('ido.time1')}</p>
          <p className="text-center">{t('ido.time2')}</p>
          <SocialLinks
            x={trumpLinks.x}
            tg={trumpLinks.tg}
            website={trumpLinks.website}
            className="my-1 text-zinc-600"
          />
          <p>{t('ido.trump407-desc')}</p>

          {isStarted && (
            <Countdown
              className="absolute right-2 top-1 text-yellow-600 text-sm"
              createdAt={startAt}
              duration={duration}
              expiredText={t('ido.ended')}
              onExpired={setIsExpired}
            />
          )}

          {isStarted ? <IdoStarted /> : <IdoNotStart onExpired={setIsStart} />}

          {!isConnected && (
            <Button
              variant="yellow"
              className="my-3 w-min"
              size="lg"
              shadow="none"
              type="button"
              onClick={() => checkForConnect()}
            >
              {t('connect')}
            </Button>
          )}

          <IdoTag className="text-base self-start mt-auto select-none px-2" />
        </AvatarCard>

        <IdoIntro className="px-6 mt-8" />
      </main>
    </IdoProvider>
  )
}

export default IdoPage
