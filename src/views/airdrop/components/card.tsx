import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { Card } from '@/components/ui/card'
import { Countdown } from '@/components/countdown'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { useAirdropInfo } from '../../../hooks/airdrop/use-airdrop-info'
import { fmt } from '@/utils/fmt'
import { MarketType } from '@/api/token/types'
import { useAirdropContext } from '@/contexts/airdrop'
import { utilLang } from '@/utils/lang'
import { IdTag } from '@/components/id-tag'

interface Props {
  airdrop: AirdropItem | undefined
  className?: string
}

export const AirdropCard = ({ airdrop, className }: Props) => {
  const { t } = useTranslation()
  const { query, pathname, ...router } = useRouter()
  const isKol = !!airdrop?.kol_name
  const { hideClaimed } = useAirdropContext()

  const { total, claimed, isClaimed, durationSeconds } = useAirdropInfo(
    isKol ? MarketType.Kol : MarketType.Community,
    airdrop?.chain,
    airdrop?.distribution_id
  )

  const onPushToken = () => {
    if (!airdrop?.chain || !airdrop?.address) return

    router.push({
      pathname: fmt.toHref(airdrop.chain, airdrop.address),
      query,
    })
  }

  if (hideClaimed && isClaimed) return

  return (
    <Card
      className={cn('p-3 max-sm:w-[96vw] max-w-[450px]', className)}
      shadow="none"
      onClick={onPushToken}
    >
      <div className="flex justify-between">
        <span className="font-bold truncate">
          {airdrop?.name}
          {airdrop?.ticker ? `(${airdrop.ticker})` : ''}
        </span>
        <Countdown
          createdAt={airdrop?.create ?? 0}
          duration={durationSeconds}
        />
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div>
          <IdTag
            src={airdrop?.kol_logo || airdrop?.community_logo}
            title={utilLang.locale(
              airdrop?.kol_name || airdrop?.community_name
            )}
            containerClass="w-[150px]"
          />
          <div className="mt-3 flex items-center">
            <img src="/images/gift.png" alt="gift" className="w-6 h-6" />
            <span className="ml-2 text-gray-500 break-all line-clamp-1">
              {BigNumber(airdrop?.amount ?? 0).toFormat()} {airdrop?.ticker}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={20} />
            <span className="ml-2">
              {BigNumber(claimed).toFormat()} / {BigNumber(total).toFormat()}
            </span>
          </div>
          <Button
            className="mt-3 font-bold w-full"
            disabled={isClaimed}
            onClick={onPushToken}
          >
            {isClaimed ? t('airdrop.claimed') : t('claim.airdrop')}
          </Button>
        </div>
        <Img src={airdrop?.logo} className="w-40 h-40 max-sm:!w-[38%] " />
      </div>
    </Card>
  )
}
