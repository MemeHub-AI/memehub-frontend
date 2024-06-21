import React, { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { Address } from 'viem'

import type { UserCoinsCreated } from '@/api/user/types'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { fmt } from '@/utils/fmt'
import { Img } from '@/components/img'
import { useTokenProgressV2 } from '@/views/token/hooks/v2/use-token-progress'

interface Props extends ComponentProps<typeof Card> {
  card: UserCoinsCreated
  descClass?: string
}

export const TokenCard = (props: Props) => {
  const { card, className, descClass, onClick, ...restProps } = props
  const router = useRouter()
  const { progress } = useTokenProgressV2(
    card.address as Address,
    Number(card.chain.id)
  )

  return (
    <Card
      className={cn(
        'flex items-stretch overflow-hidden gap-2 relative',
        className
      )}
      onClick={(e) => {
        router.push(fmt.toHref(Routes.Main, card.chain.name, card.address))
        onClick?.(e)
      }}
      {...restProps}
    >
      {/* Token logo */}
      <Img
        src={card.image}
        alt="logo"
        className="shrink-0 w-32 h-32 xl:w-40 xl:h-40"
      />
      <div className="py-1.5 xl:py-2 pr-2 w-full flex flex-col justify-between">
        <div className="h-full">
          <CardTitle className="pt-0 text-lg flex items-start justify-between gap-2 ">
            <span className="break-all line-clamp-2">
              {card?.name} {card?.ticker && `(${card?.ticker})`}
            </span>
            <img src={card.chain.logo} alt="chain" className="w-5 mt-1" />
          </CardTitle>
          <p
            className={cn(
              'text-zinc-500 text-sm break-all line-clamp-2 xl:line-clamp-3',
              descClass
            )}
          >
            {card?.desc}
          </p>
        </div>
        <div>
          <Progress
            className="h-4 self-end w-full mt-1"
            indicatorClass="bg-green-500"
            value={progress}
          />
        </div>
      </div>
    </Card>
  )
}

export default TokenCard
