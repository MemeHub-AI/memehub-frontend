import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { Countdown } from './components/countdown'
import { utilTime } from '@/utils/time'
import { Ids } from './components/ids'

const Airdrop = () => {
  const { t } = useTranslation()

  const airdrops = [
    {
      id: '1',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar1.png',
      amount: '1000',
      time: new Date('2024/6/13 12:00:00'),
    },
    {
      id: '2',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar1.png',
      amount: '1000',
      time: new Date('2024/6/13 12:00:00'),
    },
    {
      id: '3',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar1.png',
      amount: '1000',
      time: new Date('2024/6/13 12:00:00'),
    },
    {
      id: '4',
      name: 'Pudgy Penguins Holder',
      logo: '/images/avatar1.png',
      amount: '1000',
      time: new Date('2024/6/13 12:00:00'),
    },
  ]

  return (
    <main className="min-h-main flex gap-6 mx-auto max-md:flex-col max-md:items-center max-sm:gap-8 pr-5 max-sm:px-2">
      <OpportunityMoonshot defalutTab={0} className="max-sm:!hidden" />
      <div className="py-5">
        <Ids></Ids>
        <h1 className="mt-5 text-2xl">{t('airdrop.you')}</h1>
        <div className="mt-3 grid grid-cols-3 gap-4 max-2xl:grid-cols-2 max-xl:grid-cols-1 max-w-max">
          {airdrops.map((airdrop, i) => (
            <Card key={airdrop.id} className="p-2">
              <div className="flex justify-between">
                <span>Roaringtube(RTUBE)</span>
                <span className="text-red-700">
                  {utilTime.isPast(new Date('2024/6/13 12:00:00').getTime()) ? (
                    t('expired')
                  ) : (
                    <Countdown
                      targetTimestamp={new Date('2024/6/13 12:00:00').getTime()}
                    ></Countdown>
                  )}
                </span>
              </div>
              <div className="mt-3 flex">
                <div>
                  <div className="flex items-center bg-[#CBFF08] rounded-sm overflow-hidden ">
                    <img
                      src="/images/avatar1.png"
                      alt="Avatar"
                      className="w-[40px] h-[40px]"
                    />
                    <span className="mx-2 truncate">Pudgy Penguins Holder</span>
                    <img
                      src="/images/check.png"
                      alt="Avatar"
                      className="w-[40px] h-[40px] p-2"
                    />
                  </div>
                  <div className="mt-3 flex items-center">
                    <img
                      src="/images/gift.png"
                      alt="gift"
                      className="w-[30px] h-[30px]"
                    />
                    <span className="ml-2 text-gray-500">
                      1000,000,000 RTUBE
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-gray-500">
                    <TbUsers size={24} />
                    <span className="ml-2">10/100</span>
                  </div>
                  <Button className="mt-3" disabled>
                    {t('claim.airdrop')}
                  </Button>
                </div>
                <img
                  src="/images/airdrop.png"
                  className="w-[150px] h-[150px] ml-4 max-sm:w-[120px] max-sm:h-[120px]"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Airdrop
