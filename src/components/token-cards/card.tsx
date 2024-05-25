import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Address, formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { TokenListItem } from '@/api/token/types'
import { useTradeInfo } from '@/views/token/hooks/use-trade-info'

interface Props extends ComponentProps<'div'> {
  card: TokenListItem
}

export const TokenCard = ({ card, className }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { getTokenAmounts } = useTradeInfo()
  const [percent, setPercent] = useState('0')

  // Init percent progress.
  useEffect(() => {
    getTokenAmounts(card.address as Address).then(
      ([totalAmount, currentAmount]) => {
        const total = formatEther(totalAmount)
        const current = formatEther(currentAmount)

        if (total === '0' || current === '0') return
        setPercent(BigNumber(current).div(total).multipliedBy(100).toFixed(3))
      }
    )
  }, [])

  return (
    <Card
      className={cn(
        'flex items-stretch rounded overflow-hidden gap-2 relative',
        className
      )}
      hover="border"
      onClick={() => {
        router.push({
          pathname: `${Routes.Token}/${card.id}`,
          query: { address: card.address },
        })
      }}
    >
      <img src={card.image} alt="img" className="h-32 w-32 object-cover" />
      <img
        src="/images/scroll.svg"
        alt="chain"
        className="absolute right-2 top-2 w-5"
      />
      <div className="self-start py-2 pr-2 h-full w-full flex flex-col justify-between">
        <div>
          <CardTitle className="pt-2">
            {card.name} {card.ticker && `(${card.ticker})`}
          </CardTitle>
          <Link
            href={`${Routes.Account}/${card.creator.id}`}
            className="text-zinc-500 text-xs mt-0.5 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('creator')}: {card.creator.name}
          </Link>
          <p className="text-zinc-500 text-sm break-all line-clamp-4">
            {card.desc}
          </p>
        </div>
        <Progress
          className="h-4 self-end w-full mt-1"
          indicatorClass="bg-green-500"
          value={Number(percent)}
          label={percent}
        />
      </div>
    </Card>
  )
}

export default TokenCard
