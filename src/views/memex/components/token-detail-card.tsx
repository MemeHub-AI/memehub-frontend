import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import { zeroAddress } from 'viem'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { SocialLinks } from '@/components/social-links'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { MemexIdeaItem } from '@/api/memex/types'
import { fmt } from '@/utils/fmt'
import { CopyIcon } from '@/components/copy-icon'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTokenDetails } from '@/hooks/use-token-details'

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
    chain,
  } = details ?? {}
  const { t } = useTranslation()
  const { chainId } = useChainInfo(chain)
  const { progress } = useTokenDetails(
    chainId,
    details?.coin_version!,
    tokenAddr,
    details?.bond_version!,
    details?.bond_address!
  )
  // console.log('detail', details)
  const isZero = tokenAddr === zeroAddress
  const hasLinks = !!twitter_url || !!telegram_url || !!website_url

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
      <div className="flex space-x-2 mb-2">
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

      <div
        className={cn(
          'flex justify-between items-center',
          hasLinks && !editable && !isZero && 'mt-2'
        )}
      >
        {hasLinks ? (
          <SocialLinks
            className={editable ? 'my-1' : 'mt-0'}
            buttonProps={{ size: 'icon-sm' }}
            x={twitter_url!}
            tg={telegram_url!}
            website={website_url!}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div></div>
        )}
        {!editable && !isZero && (
          <Button
            shadow="none"
            size="sm"
            className="bg-transparent bg-yellow-600 border-none text-white h-7"
            onClick={onBuyClick}
          >
            {t('go-to.trade')}
          </Button>
        )}
      </div>

      {!editable && !isZero && (
        <Progress
          value={progress}
          className="h-5 border-2 border-black rounded mt-2 text-white"
          indicatorClass="bg-purple-600"
        />
      )}

      {tokenAddr && !isZero && (
        <div className="flex items-center space-x-1 mt-1">
          <span>CA: {fmt.addr(tokenAddr)}</span>
          <CopyIcon content={tokenAddr} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Card>
  )
}

export default TokenDetailsCard
