import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { TokenSocialLinks } from '@/components/token-links'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { MemexCreateReq } from '@/api/memex/types'

interface Props {
  details?: Omit<
    MemexCreateReq,
    'chain' | 'content' | 'image_urls' | 'factory_address'
  >
  editable?: boolean
  onBuyClick?: () => void
}

export const TokenDetailsCard = ({
  className,
  details,
  editable = false,
  onBuyClick,
  ...props
}: ComponentProps<typeof Card> & Props) => {
  const { name, symbol, logo_url, twitter_url, telegram_url, website_url } =
    details ?? {}
  const { t } = useTranslation()
  // TODO/memex: use contract progress
  const progress = 34

  return (
    <Card
      shadow="none"
      padding="sm"
      className={cn(
        'border-zinc-300 border rounded relative',
        editable && 'border-blue-600 border-2',
        className
      )}
      {...props}
    >
      {editable && (
        <AiOutlineEdit
          size={22}
          className="text-blue-600 absolute top-1 right-1"
        />
      )}
      <div className="flex space-x-2">
        <Avatar src={logo_url} fallback={symbol?.[0]} />
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
          x={twitter_url}
          tg={telegram_url}
          website={website_url}
          onClick={(e) => e.stopPropagation()}
        />
        {!editable && (
          <Button
            shadow="none"
            size="xs"
            className="bg-transparent py-3"
            onClick={onBuyClick}
          >
            {t('go-to.buy')}
          </Button>
        )}
      </div>

      {!editable && (
        <Progress
          value={progress}
          className="h-5 border-2 border-black rounded bg-white"
          indicatorClass="bg-cyan-400"
        />
      )}
    </Card>
  )
}

export default TokenDetailsCard
