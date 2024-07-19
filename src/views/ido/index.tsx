import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { InfoIcon } from 'lucide-react'
import { BigNumber } from 'bignumber.js'

import { AvatarCard } from '@/components/avatar-card'
import { TokenSocialLinks } from '@/components/token-links'
import { Countdown } from '@/components/countdown'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const usdtAmount = '20000U'

const kol = 'Zhang3'
const kolAmount = '80USDT'

const isEnded = true
const hasDonated = true

const hasClaim = true

const hasWaiting = false

const claimed = true

const isRefund = true
const isRefunded = true

export const IdoPage = () => {
  const { t } = useTranslation()
  const [isStarted, setIsStarted] = useState(false)

  return (
    <main className="bg-orange-500 min-h-body px-3 pt-3">
      <AvatarCard
        src="/images/ai.png"
        border="none"
        avatarClass="!border-orange-500"
        className="flex flex-col bg-white rounded max-w-100 mx-auto sm:mt-32"
      >
        <img
          src="/images/ido/work.jpeg"
          alt="poster"
          className={cn(
            'w-48 absolute -right-28 -bottom-28 z-0 border-2 border-white rounded -rotate-[65deg]',
            'sm:w-36 sm:-right-16 sm:-bottom-12',
          )}
        />
        <h2 className="font-bold text-xl text-center">PP405</h2>
        <TokenSocialLinks
          x="https://x.com"
          tg="https://t.me"
          website="https://mememhub.ai"
          className="mt-0 text-zinc-600"
        />
        <p className="text-sm">{t('ido.405')}</p>

        {isStarted && !isEnded && (
          <div className="absolute right-2 top-1 text-yellow-600">
            71h: 23m: 23s
          </div>
        )}

        {isStarted ? (
          <div className="w-full">
            <Progress
              className="h-5 mt-3 rounded"
              indicatorClass="bg-green-500"
              value={32}
            />
            <div className="flex items-center justify-between text-sm">
              <span>6000 USDT</span>
              <span>20000 USDT</span>
            </div>
          </div>
        ) : (
          <>
            <Countdown
              createdAt={dayjs().unix()}
              duration={3}
              prefix={t('ido.start-in')}
              className="text-blue-600 mt-3"
              onExpired={setIsStarted}
            />
            <div className="flex items-center space-x-1 text-zinc-600 mt-3">
              <span>
                {t('ido.total-amount')}: {usdtAmount}
              </span>
              <InfoIcon className="w-4" />
            </div>
          </>
        )}

        {kol && (
          <p className="text-zinc-500 text-sm mt-3 z-10">
            {t('ido.detect').replace('{}', kol).replace('{}', kolAmount)}
          </p>
        )}

        {isEnded && !hasClaim && (
          <div className="font-bold z-10">
            <p className="flex items-center space-x-1.5">
              <span>{t('ido.ended1')}</span>
              <InfoIcon className="w-4 cursor-pointer" />
            </p>
            <p>{t('ido.ended2')}</p>
          </div>
        )}

        {isEnded && hasClaim && !isRefund && (
          <div className="">
            <p>{t('ido.ended-desc1')}</p>
            <p>{t('ido.ended-desc2').replace('{}', kolAmount)}</p>
            {hasWaiting && <p>{t('ido.ended-desc3')}</p>}
          </div>
        )}

        {isRefund && <p className="text-sm mt-1 z-10">{t('ido.no-win')}</p>}

        {isStarted && hasDonated ? (
          <>
            {hasClaim ? (
              isRefund ? (
                <Button
                  shadow="none"
                  size="sm"
                  className="text-base self-start mt-3 bg-yellow-200 select-none"
                  disabled={isRefunded}
                >
                  {t('ido.refund')} {kolAmount}
                </Button>
              ) : (
                <Button
                  shadow="none"
                  size="sm"
                  className="text-base self-start mt-3 bg-yellow-200 select-none"
                  disabled={hasWaiting || claimed}
                >
                  {t('ido.claim')} {BigNumber(12312312312).toFormat()} PP405
                </Button>
              )
            ) : (
              <Button
                shadow="none"
                size="sm"
                className="text-base self-start mt-3 bg-yellow-200 select-none"
                disabled
              >
                {t('ido.donate')} 10 USDT
              </Button>
            )}
          </>
        ) : (
          <Button
            shadow="none"
            variant="warning"
            size="sm"
            className="text-base self-start mt-3 select-none"
          >
            100x {t('coin')}
          </Button>
        )}
      </AvatarCard>
    </main>
  )
}

export default IdoPage
