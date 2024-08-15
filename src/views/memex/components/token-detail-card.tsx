import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdContentCopy } from 'react-icons/md'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { TokenSocialLinks } from '@/components/token-links'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { MemexIdeaItem } from '@/api/memex/types'
import { useTokenProgress } from '@/views/token/hooks/evm/use-token-progress'
import { useChainsStore } from '@/stores/use-chains-store'
import { fmt } from '@/utils/fmt'
import CopyIcon from '@/components/copy-icon'

interface Props {
  details?: MemexIdeaItem
  editable?: boolean
  tokenAddr?: string
  onBuyClick?: () => void
}

export const TokenDetailsCard = ({
  className,
  details,
  editable = false,
  tokenAddr,
  onBuyClick,
  ...props
}: ComponentProps<typeof Card> & Props) => {
  const {
    name,
    symbol,
    logo_url,
    twitter_url,
    telegram_url,
    website_url,
    chain: chainName,
  } = details ?? {}
  const { t } = useTranslation()
  const { chainsMap } = useChainsStore()

  const { progress } = useTokenProgress(
    details?.ido_address,
    +(chainsMap[chainName || '']?.id || 0),
    '0.1.2' // TODO: dynamic version
  )

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
      onClick={(e) => {
        e.stopPropagation()
        props.onClick?.(e)
      }}
    >
      {editable && (
        <AiOutlineEdit
          size={22}
          className="text-blue-600 absolute top-1 right-1"
        />
      )}
      <div className="flex space-x-2">
        <Avatar src={logo_url || ''} fallback={symbol?.[0]} />
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
          x={twitter_url || ''}
          tg={telegram_url || ''}
          website={website_url || ''}
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
          indicatorClass="bg-purple-600"
        />
      )}

      {tokenAddr && (
        <div className="flex items-center space-x-1 mt-1">
          <span>CA: {fmt.addr(tokenAddr)}</span>
          <CopyIcon content={tokenAddr} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Card>
  )
}

export default TokenDetailsCard
