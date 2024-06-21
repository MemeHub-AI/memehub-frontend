import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { useRouter } from 'next/router'

import { Card } from '@/components/ui/card'
import { Countdown } from './countdown'
import { utilTime } from '@/utils/time'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { getDistributorConfig } from '@/contract/v2/config/distributor'
import { useChainInfo } from '@/hooks/use-chain-info'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { fmt } from '@/utils/fmt'

interface Props {
  airdrop: AirdropItem | undefined
  className?: string
}

export const AirdropCard = ({ airdrop, className }: Props) => {
  const { t } = useTranslation()
  const { chainId } = useChainInfo(airdrop?.chain)
  const router = useRouter()

  const config = getDistributorConfig(chainId)

  const { data: amountLeft } = useReadContract({
    ...config!,
    functionName: 'getAmountLeft',
    args: [BigInt(airdrop?.distribution_id ?? 0)],
  })
  const { data: amountClaimed } = useReadContract({
    ...config!,
    functionName: 'getAmountClaimed',
    args: [BigInt(airdrop?.distribution_id ?? 0)],
  })

  const onPushToken = () => {
    if (!airdrop?.chain || !airdrop?.address) return
    router.push(fmt.toHref(airdrop?.chain, airdrop?.address))
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
          {utilTime.isPast(airdrop!.create) ? (
            t('expired')
          ) : (
            <Countdown targetTimestamp={airdrop!.create * 1000}></Countdown>
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
              {formatEther(amountClaimed ?? BigInt(0))} /{' '}
              {formatEther(amountLeft ?? BigInt(0))}
            </span>
          </div>
          <Button
            className="mt-3 font-bold"
            disabled={utilTime.isPast(airdrop!.create)}
            onClick={onPushToken}
          >
            {t('claim.airdrop')}
          </Button>
        </div>
        <Img src={airdrop?.logo} className="w-36 h-36 xl:w-42 xl:h-42" />
      </div>
    </Card>
  )
}
