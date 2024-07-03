import React, { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { Address } from 'viem'
import { useTranslation } from 'react-i18next'

import type { UserCoinsCreated } from '@/api/user/types'
import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { fmt } from '@/utils/fmt'
import { Img } from '@/components/img'
import { useTokenProgressV3 } from '@/views/token/hooks/trade-v3/use-token-progress'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'

interface Props extends ComponentProps<typeof Card> {
  card: UserCoinsCreated
  descClass?: string
}

export const TokenCard = (props: Props) => {
  const { card, className, descClass, onClick, ...restProps } = props
  const router = useRouter()
  const { t } = useTranslation()

  const { progress, isGrauated } = useTokenProgressV3(
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
      {isGrauated && (
        <Badge
          variant="success"
          className="absolute left-0 top-0 rounded-l-none rounded-tr-none"
        >
          {t('token.graduated')}
        </Badge>
      )}

      <Img
        src={card.image}
        alt="logo"
        className="shrink-0 w-32 h-32 xl:w-40 xl:h-40 rounded-r-none"
      />
      <div className="py-1.5 xl:py-2 pr-2 w-full flex flex-col justify-between">
        <div className="h-full">
          <CardTitle className="pt-0 text-lg flex items-start justify-between gap-2 ">
            <span className="break-all line-clamp-2">
              {card?.name} {card?.ticker && `(${card?.ticker})`}
            </span>
            <Avatar
              src={card.chain.logo}
              alt="logo"
              size={20}
              className="mt-1"
            />
          </CardTitle>
          <p
            className={cn(
              'text-zinc-500 text-sm break-all line-clamp-2 xl:line-clamp-3',
              isGrauated && 'line-clamp-4 xl:line-clamp-5',
              descClass
            )}
          >
            {card?.desc}
          </p>
        </div>
        <Progress
          className="h-5 self-end w-full"
          indicatorClass="bg-green-500"
          value={isGrauated ? 100 : progress}
        />
      </div>
    </Card>
  )
}

export default TokenCard
