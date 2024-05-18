import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { TokenListResult } from '@/api/token/types'

interface Props extends ComponentProps<'div'> {
  card: TokenListResult
}

export const TokenCard = ({ card, className }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const percent = 0

  console.log('card', card)

  return (
    <Card
      className={cn(
        'flex items-stretch rounded overflow-hidden gap-2 relative',
        className
      )}
      hover="border"
      onClick={() => router.push(`${Routes.Token}/${card.address}`)}
    >
      <img src={card.image} alt="img" className="h-32 w-32 object-cover" />
      <img
        src="https://scrollscan.com/images/svg/brands/main.svg"
        alt="chain"
        className="absolute right-2 top-2 w-5"
      />
      <div className="self-start py-2 pr-2 h-full w-full flex flex-col justify-between">
        <div>
          <CardTitle className="pt-2">
            {card.name} {card.ticker && `(${card.ticker})`}
          </CardTitle>
          <Link
            href={`${Routes.Account}/${card.address}`}
            className="text-zinc-500 text-xs mt-0.5 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('creator')}: {card.creator_name}
          </Link>
          <p className="text-zinc-500 text-sm break-all line-clamp-4">
            {card.description}
          </p>
        </div>
        <Progress
          className="h-4 self-end w-full mt-1"
          indicatorClass="bg-green-500"
          value={percent}
          label={percent}
        />
      </div>
    </Card>
  )
}

export default TokenCard
