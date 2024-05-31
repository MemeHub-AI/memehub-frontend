import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Address, formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import type { UserCoinsCreated } from '@/api/user/types'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { useTradeInfo } from '@/views/token/hooks/use-trade-info'

interface Props extends ComponentProps<'div'> {
  card: UserCoinsCreated
}

export const TokenCard = ({ card, className }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { getTokenAmounts } = useTradeInfo()
  const [percent, setPercent] = useState('0')

  // Init percent progress.
  useEffect(() => {
    getTokenAmounts(card?.address as Address).then(
      ([totalAmount, currentAmount]) => {
        const total = formatEther(totalAmount)
        const current = formatEther(currentAmount)

        if (total === '0' || current === '0') return
        setPercent(BigNumber(current).div(total).multipliedBy(100).toFixed(2))
      }
    )
  }, [])

  return (
    <Card
      className={cn(
        'flex items-stretch overflow-hidden gap-2 relative',
        className
      )}
      onClick={() => {
        router.push(`${Routes.Main}/${card.chain.name}/${card.address}`)
      }}
    >
      <img
        src={card?.image || '/images/logo.png'}
        alt="img"
        className="flex-shrink-0 h-40 w-40 object-cover"
        width={160}
        height={160}
      />
      <img
        src="/images/scroll.svg"
        alt="chain"
        className="absolute right-2 top-2 w-5"
      />
      <div className="py-2 pr-2 w-full flex flex-col justify-between">
        <div className="h-full">
          <CardTitle className="pt-0 text-lg">
            {card?.name} {card?.ticker && `(${card?.ticker})`}
          </CardTitle>
          {/* <Link
            href={`${Routes.Account}/${card?.creator.wallet_address}`}
            className="text-zinc-500 text-xs mt-0.5 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('creator')}: {card?.creator.name}
          </Link> */}
          <p className="text-zinc-500 text-sm break-all line-clamp-3">
            {card?.desc}
          </p>
        </div>
        <div>
          <Progress
            className="h-4 self-end w-full mt-1"
            indicatorClass="bg-green-500"
            value={Number(percent)}
            label={percent}
          />
        </div>
      </div>
    </Card>
  )
}

export default TokenCard
