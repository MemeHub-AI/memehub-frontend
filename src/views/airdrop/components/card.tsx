import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { Card } from '@/components/ui/card'
import { Countdown } from './countdown'
import { utilTime } from '@/utils/time'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { fmt } from '@/utils/fmt'
import { MarketType } from '@/api/token/types'
import { useAirdropInfo } from '../hooks/use-airdrop-info'

interface Props {
  airdrop: AirdropItem | undefined
  className?: string
}

export const AirdropCard = ({ airdrop, className }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isPast = utilTime.isPast(airdrop?.create ?? 0)

  const { amountLeft, amountClaimed, isClaimed } = useAirdropInfo(
    airdrop?.chain,
    airdrop?.distribution_id
  )

  const onPushToken = () => {
    if (!airdrop?.chain || !airdrop?.address) return

    const query: Record<string, string> = {
      id: airdrop?.distribution_id.toString(),
    }
    if (airdrop.kol_name) {
      query.type_list = MarketType.Kol.toString()
    } else if (airdrop.community_name) {
      query.type_list = MarketType.Community.toString()
    }

    router.push({
      pathname: fmt.toHref(airdrop?.chain, airdrop?.address),
      query,
    })
  }

  return (
    <Card
      className={cn('p-3 max-sm:w-[96vw]', className)}
      shadow="none"
      onClick={onPushToken}
    >
      <div className="flex justify-between">
        <span className=" font-bold">
          {airdrop?.name}
          {airdrop?.ticker ? `(${airdrop.ticker})` : ''}
        </span>
        <span className="text-gray-500">
          {isPast ? (
            t('expired')
          ) : (
            <Countdown
              targetTimestamp={(airdrop?.create ?? 0) * 1000}
            ></Countdown>
          )}
        </span>
      </div>
      <div className="mt-3 flex justify-between gap-4">
        <div className="">
          <div className="flex items-center justify-between rounded bg-lime-green">
            <div className="flex items-center w-[150px]">
              <Img
                src={airdrop?.kol_logo || airdrop?.community_logo}
                alt="avatar"
                className="w-10 h-10 shrink-0 rounded-r-none"
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
              {BigNumber(airdrop?.amount ?? 0).toString()} {airdrop?.ticker}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={24} />
            <span className="ml-2">
              {amountClaimed} / {amountLeft}
            </span>
          </div>
          <Button
            className="mt-3 font-bold w-full"
            disabled={isPast || isClaimed}
            onClick={onPushToken}
          >
            {isClaimed ? t('airdrop.claimed') : t('claim.airdrop')}
          </Button>
        </div>
        <Img src={airdrop?.logo} className="w-36 h-36 xl:w-42 xl:h-42" />
      </div>
    </Card>
  )
}
