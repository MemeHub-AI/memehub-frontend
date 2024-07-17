import React, { ComponentProps } from 'react'
import { BsTwitter } from 'react-icons/bs'
import { BiLogoTelegram } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { Card } from '@/components/ui/card'
import { Countdown } from '@/views/airdrop/components/countdown'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<typeof Card> {}

export const IdoCard = ({ className, children, ...props }: Props) => {
  const { t } = useTranslation()
  const card = {
    name: 'MPEPE',
    avatar: 'https://storage.memehub.ai/avater.png',
    createAt: +(dayjs().add(3, 'day').toDate().getTime() / 1000).toFixed(0),
    progress: 33,
    current: 3,
    total: 5.7,
    buy: '0.05ETH',
    tips: 'ido.kol.tips',
    descrition: `My Life According To is a survey which spread on Facebook in early 2009. Participants fill out the survey, which asks a series of basic and deeper questions about the survey taker, using song titles from a single band or musician or the survey taker's choice.`,
  }

  return (
    <Card padding="md" shadow="none" className={cn(className)}>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <img
            src={card.avatar}
            alt="avater"
            className="w-[50px] h-[50px] border-2 border-black rounded-sm"
          />
          <div className="flex flex-col justify-between">
            <div className="leading-none">{card.name}</div>
            <div className="flex mt-1 space-x-2">
              <BsTwitter size={20} />
              <BiLogoTelegram size={22} />
            </div>
          </div>
        </div>
        {/* <span className="text-yellow-700">72h24m23s</span> */}
        <Countdown createdAt={Date.now()} duration={Date.now() + 6} />
      </div>
      <div className="my-1 line-clamp-2">{card.descrition}</div>
      <Progress
        className="h-5 rounded-sm text-white"
        value={+(card.current / card.total).toFixed(2) * 100}
      />
      <>
        <div className="flex justify-between my-1 text-sm">
          <span>{card.current}ETH</span>
          <span>{card.total}ETH</span>
        </div>
        <Button className="bg-yellow-100 text-black hover:bg-white">
          {t('ido.buy')} 0.05ETH
        </Button>
        <div className="text-sm mt-1 text-gray-500">
          {true ? t('ido.kol.tips') : t('ido.community.tips')}
        </div>
      </>
    </Card>
  )
}

export default IdoCard
