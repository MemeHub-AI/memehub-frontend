import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { TokenSocialLinks } from '@/components/token-links'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  symbol: string
  logoUrl: string
  xUrl: string
  tgUrl: string
  websiteUrl: string
  onBuyClick?: () => void
}

export const TokenDetailCard = ({
  className,
  name,
  symbol,
  logoUrl,
  xUrl,
  tgUrl,
  websiteUrl,
  onBuyClick,
}: ComponentProps<typeof Card> & Props) => {
  const { t } = useTranslation()
  // TODO: use contract progress
  const progress = 34

  return (
    <Card
      shadow="none"
      padding="sm"
      className={cn('border-zinc-300 border rounded', className)}
    >
      <div className="flex space-x-2">
        <Avatar src={logoUrl} fallback={symbol?.[0]} />
        <div className="text-zinc-500 text-sm flex flex-col justify-between">
          <p>
            {t('memex.symbol')}: <span className="text-black">{symbol}</span>
          </p>
          <p>
            {t('name')}: <span className="text-black">{name}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center my-1">
        <TokenSocialLinks
          className="mt-0 space-x-0"
          buttonProps={{
            size: 'icon-sm',
            className: 'border-none hover:bg-transparent',
          }}
          x={xUrl}
          tg={tgUrl}
          website={websiteUrl}
        />
        <Button
          shadow="none"
          size="xs"
          className="bg-transparent py-3"
          onClick={onBuyClick}
        >
          {t('go-to.buy')}
        </Button>
      </div>

      <Progress
        value={progress}
        className="h-5 border-2 border-black rounded bg-white"
        indicatorClass="bg-cyan-400"
      />
    </Card>
  )
}

export default TokenDetailCard
