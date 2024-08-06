import React, { useState, type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { Address } from 'viem'
import { useTranslation } from 'react-i18next'
import { isNumber } from 'lodash'

import type { UserCoinsCreated } from '@/api/user/types'
import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { fmt } from '@/utils/fmt'
import { Img } from '@/components/img'
import { useTokenProgressV1 } from '@/views/token/hooks/trade-v1/use-token-progress'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'
import { useChainsStore } from '@/stores/use-chains-store'
import { IdoTag } from '../ido-tag'
import { Countdown } from '@/components/countdown'

interface Props extends ComponentProps<typeof Card> {
  card: UserCoinsCreated
  descClass?: string
  idoCreateAt?: number
  idoDuration?: number
  idoEndAt?: number
  idoProgress?: number | string
}

export const TokenCard = (props: Props) => {
  const {
    card,
    className,
    descClass,
    onClick,
    idoCreateAt,
    idoDuration,
    idoProgress,
    ...restProps
  } = props
  const router = useRouter()
  const { t } = useTranslation()
  const { evmChainsMap } = useChainsStore()
  const chain = evmChainsMap[card.chain.id]

  const [isExpired, setIsExpired] = useState(false)

  const { progress, isGrauated } = useTokenProgressV1(
    card.address as Address,
    Number(card.chain.id)
  )
  const isIdo = isNumber(idoCreateAt) && isNumber(idoDuration)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isIdo && card.address) {
      return router.push(fmt.toHref(Routes.Main, card.chain.name, card.address))
    }
    if (isIdo) {
      return router.push(fmt.toHref(Routes.Ido, card.chain.name, card.id))
    }
    router.push(fmt.toHref(Routes.Main, card.chain.name, card.address))
    onClick?.(e)
  }

  return (
    <Card
      className={cn(
        'flex items-stretch overflow-hidden gap-2 relative max-sm:gap-0',
        className
      )}
      onClick={handleClick}
      {...restProps}
    >
      {isGrauated && (
        <Badge
          variant="success"
          className="absolute left-0 top-0 rounded-l-none rounded-tr-none mr-2"
        >
          {t('token.graduated')}
        </Badge>
      )}
      <Img
        src={card.image}
        alt="logo"
        title={card.name}
        className="shrink-0 w-32 h-32 xl:w-40 xl:h-40 rounded-r-none max-sm:mr-2"
      />
      <div className="py-1.5 xl:py-2 pr-2 w-full flex flex-col justify-between">
        <div className="h-full">
          <CardTitle className="pt-0 text-lg flex items-start justify-between gap-2 ">
            <span
              className={cn('break-all line-clamp-2', isIdo && 'line-clamp-1')}
            >
              {card?.ticker}({card?.name})
            </span>
            <Avatar
              src={card.chain.logo}
              alt="logo"
              size={20}
              className="mt-1"
              title={chain?.displayName}
            />
          </CardTitle>
          {isIdo && <IdoTag />}
          <p
            className={cn(
              'text-zinc-500 text-sm break-all line-clamp-2 xl:line-clamp-3',
              isGrauated && 'line-clamp-4 xl:line-clamp-5',
              isIdo && 'line-clamp-2 xl:line-clamp-3',
              descClass
            )}
          >
            {card?.desc}
          </p>
        </div>
        {isIdo && !isExpired ? (
          <div className="font-bold flex items-center space-x-1 leading-none">
            <span>{t('ido.start-in')}</span>
            <Countdown
              className="text-blue-600"
              createdAt={idoCreateAt || 0}
              duration={idoDuration || 0}
              onExpired={setIsExpired}
              onInitExpired={setIsExpired}
            />
          </div>
        ) : (
          <Progress
            className={cn('h-5 self-end w-full', isIdo && 'text-white')}
            indicatorClass={isIdo ? 'bg-red-500' : 'bg-green-500'}
            value={idoProgress || (isGrauated ? 100 : progress)}
          />
        )}
      </div>
    </Card>
  )
}

export default TokenCard
