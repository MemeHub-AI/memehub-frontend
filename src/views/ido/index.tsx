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
import { Input } from '@/components/ui/input'

export const IdoPage = () => {
  const { t } = useTranslation()
  const [isStarted, setIsStarted] = useState(false)

  return (
    <main className="bg-orange-500 min-h-body px-3 pt-3 overflow-hidden">
      <AvatarCard
        src="/images/trump.jpeg"
        border="none"
        avatarClass="!border-orange-500"
        className="flex flex-col bg-white rounded max-w-100 mx-auto sm:mt-32"
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
          className="mt-0 text-zinc-600"
        />
        <p className="text-sm">{t('ido.405')}</p>

        <div className="absolute right-2 top-1 text-yellow-600">
          71h: 23m: 23s
        </div>

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
            <div className="flex items-center space-x-1 mt-3">
              <span className="font-bold mr-1">{t('ido.total-amount')}:</span>
              50BNB
              <InfoIcon className="w-4" />
            </div>
            <Countdown
              createdAt={dayjs().unix()}
              duration={3}
              prefix={<span className="font-bold"> {t('ido.start-in')}:</span>}
              className="font-normal text-black"
              onExpired={setIsStarted}
            />
            <div className="">
              <span className="font-bold mr-1">{t('ido.eligibility')}: </span>
              {t('ido.holder-nft')}
            </div>
          </>
        )}

        <div className="mt-3 flex items-center space-x-1">
          <Input
            className="max-w-40 h-9"
            inputClass="pl-2 pr-0"
            placeholder={t('ido.input-amount')}
            endIcon={
              <span className="text-blue-600 text-sm mr-1">Max(10)</span>
            }
          />
          <div className="flex items-center space-x-1">
            <img src="/images/bsc.svg" alt="bnb" className="w-5" />
            <span>BNB</span>
          </div>
        </div>
        <Button className="mt-3 w-min bg-yellow-200" size="lg" shadow="none">
          {t('ido.join')}
        </Button>

        <div className="flex items-center space-x-2 mt-3">
          <Button className="bg-yellow-200" shadow="none">
            {t('ido.claim')} 1.2 LP
          </Button>
          <Button shadow="none">{t('ido.refund')} 343 BNB</Button>
        </div>

        <div className="mt-3 text-purple-500 font-bold">
          <p>{t('ido.participated')} 3 BNB x 125%</p>
          <p>
            <span>{t('ido.obtained')}</span>
            <span className="text-xl mx-1">5%</span>
            <span>{t('ido.quota')}</span>
          </p>
        </div>

        <p className="text-sm text-zinc-500 mt-3">{t('ido.policy1')}</p>
        <p className="text-sm text-zinc-500 my-1">{t('ido.policy2')}</p>

        <div className="text-zinc-500 text-sm z-10 space-y-1">
          <p>{t('ido.detect').split('$')[0].replace('{}', 'Z3')}</p>
          <p>{t('ido.detect').split('$')[1].replace('{}', '25%')}</p>
        </div>

        <Button
          shadow="none"
          variant="warning"
          size="sm"
          className="text-base self-start mt-5 select-none"
        >
          🚀 100x {t('coin')}
        </Button>
      </AvatarCard>
    </main>
  )
}

export default IdoPage
