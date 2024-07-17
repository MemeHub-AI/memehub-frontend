import { BsTwitter } from 'react-icons/bs'
import { BiLogoTelegram } from 'react-icons/bi'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Countdown } from '@/views/airdrop/components/countdown'

interface Props {}

const idoCard = [
  {
    name: 'MPEPE',
    avatar: 'https://storage.memehub.ai/avater.png',
    createAt: +(dayjs().add(3, 'day').toDate().getTime() / 1000).toFixed(0),
    progress: 33,
    current: 3,
    total: 5.7,
    buy: '0.05ETH',
    tips: 'ido.kol.tips',
    descrition: `My Life According To is a survey which spread on Facebook in early 2009. Participants fill out the survey, which asks a series of basic and deeper questions about the survey taker, using song titles from a single band or musician or the survey taker's choice.`,
  },
]

export const IdoCards = (props: Props) => {
  const { t } = useTranslation()

  const handleIdoStatus = (card: (typeof idoCard)[number]) => {
    if (dayjs().diff(card.createAt * 1000)) {
      return (
        <>
          <div className="flex justify-between my-1 text-[14px]">
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
      )
    }
  }

  return (
    <div className="grid grid-cols-2 justify-between">
      {idoCard.map((card) => (
        <>
          {/* @ts-ignore */}
          <Card className="p-2 w-full" shadow={false}>
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
              <span className="text-yellow-700">72h24m23s</span>
            </div>
            <div className="my-1">{card.descrition}</div>
            <Progress
              className="h-[18px] rounded-sm text-white"
              value={+(card.current / card.total).toFixed(2) * 100}
            />
            {handleIdoStatus(card)}
          </Card>
        </>
      ))}
    </div>
  )
}
