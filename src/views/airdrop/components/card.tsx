import { Card } from '@/components/ui/card'
import { Countdown } from './countdown'
import { utilTime } from '@/utils/time'
import { useTranslation } from 'react-i18next'
import { AirdropItem } from '@/api/alliance/type'
import { TbUsers } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { defaultImg } from '@/config/link'

interface Props {
  airdrop: AirdropItem | undefined
  className?: string
}

export const AirdropCard = ({ airdrop, className }: Props) => {
  const { t } = useTranslation()

  return (
    <Card className={`p-2 max-sm:w-[96vw] ${className}`}>
      <div className="flex justify-between">
        <span>
          {airdrop?.name}
          {airdrop?.ticker ? `(${airdrop.ticker})` : ''}
        </span>
        <span className="text-gray-500">
          {utilTime.isPast(airdrop!.create) ? (
            t('expired')
          ) : (
            <Countdown targetTimestamp={airdrop!.create * 1000}></Countdown>
          )}
        </span>
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between bg-[#CBFF08] rounded-sm">
            <div className="flex items-center w-[150px]">
              <img
                src={airdrop?.kol_logo || airdrop?.community_logo || defaultImg}
                alt="Avatar"
                className="w-[40px] h-[40px] flex-shrink-0"
              />
              <span className="mx-2 truncate w-[80%]">
                {airdrop?.kol_name || airdrop?.community_name}
              </span>
            </div>
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
              1000,000,000 {airdrop?.ticker}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={24} />
            <span className="ml-2">10/100</span>
          </div>
          <Button
            className="mt-3"
            disabled={utilTime.isPast(airdrop!.create)}
            onClick={() => {
              open(`/${airdrop?.chain}/${airdrop?.address}`)
            }}
          >
            {t('claim.airdrop')}
          </Button>
        </div>
        <img
          src={airdrop?.logo || defaultImg}
          className="w-[140px] h-[140px] ml-4 flex-shrink-0 object-cover"
        />
      </div>
    </Card>
  )
}