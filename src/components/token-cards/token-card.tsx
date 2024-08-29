import { useState, type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { isNumber } from 'lodash'
import { toast } from 'sonner'
import { zeroAddress } from 'viem'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'
import { Img } from '@/components/img'
import { Avatar } from '../ui/avatar'
import { IdoTag } from '../ido-tag'
import { Countdown } from '@/components/countdown'
import { TokenListItem } from '@/api/token/types'
import { useChainInfo } from '@/hooks/use-chain-info'
import { TokenCardBadge } from './token-card-badge'
import { Button } from '../ui/button'
import { joinPaths } from '@/utils'
import { PoolItem } from '@/hooks/token/use-tokens-pools'
import { BI_ZERO } from '@/constants/number'
import { getTokenProgress } from '@/utils/contract'

interface Props extends ComponentProps<typeof Card> {
  card: TokenListItem
  descClass?: string
  idoCreateAt?: number
  idoDuration?: number
  idoEndAt?: number
  idoProgress?: number | string

  pool: PoolItem | undefined
  onlyGraduated?: boolean
}

export const TokenCard = ({
  card,
  className,
  descClass,
  onClick,
  idoCreateAt,
  idoDuration,
  idoProgress,

  pool,
  onlyGraduated,
  ...props
}: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isExpired, setIsExpired] = useState(false)
  const { chain, chainName } = useChainInfo(card.chain)
  const isIdo = isNumber(idoCreateAt) && isNumber(idoDuration)

  const {
    tokenReserve = BI_ZERO,
    headmaster = zeroAddress,
    maxSupply = BI_ZERO,
  } = pool ?? {}
  const isGraduated = headmaster !== zeroAddress

  const progress = getTokenProgress(tokenReserve, maxSupply, isGraduated)

  const handleClick = () => {
    if (!card.is_active) {
      toast.error(t('token.active-first'))
      return
    }

    // Graduated ido
    if (isIdo && card.contract_address) {
      return router.push(
        joinPaths(Routes.Main, chainName, card.contract_address)
      )
    }

    // Processing ido
    if (isIdo) {
      return router.push(joinPaths(Routes.Ido, chainName, card.id))
    }

    router.push(joinPaths(Routes.Main, chainName, card.contract_address))
  }

  if (onlyGraduated && !isGraduated) return

  return (
    <Card
      className={cn(
        'flex items-stretch overflow-hidden gap-2 relative max-sm:gap-0',
        className
      )}
      onClick={(e) => {
        handleClick()
        onClick?.(e)
      }}
      shadow={card.is_active ? 'default' : 'none'}
      {...props}
    >
      <TokenCardBadge token={card} isGraduated={isGraduated} />

      <Img
        src={card.image_url}
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
              {card?.symbol}({card?.name})
            </span>
            <Avatar
              src={chain?.logo}
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
              isGraduated && 'line-clamp-4 xl:line-clamp-5',
              isIdo && 'line-clamp-2 xl:line-clamp-3',
              descClass
            )}
          >
            {card?.description}
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
        ) : card.is_active ? (
          <Progress
            className={cn('h-5 self-end w-full', isIdo && 'text-white')}
            indicatorClass={isIdo ? 'bg-red-500' : 'bg-green-500'}
            value={progress}
          />
        ) : (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toast.info('Coming Soon')
            }}
          >
            {t('token.activate')}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default TokenCard
