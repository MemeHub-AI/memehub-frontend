import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from 'lucide-react'
import { BigNumber } from 'bignumber.js'

import { cn } from '@/lib/utils'
import { useTokenContext } from '@/contexts/token'
import { useClipboard } from '@/hooks/use-clipboard'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'
import { utilLang } from '@/utils/lang'
import { LISTED_MARKET_CAP } from '@/constants/trade'
import { useResponsive } from '@/hooks/use-responsive'
import { Badge } from '@/components/ui/badge'
import { usePools } from '../hooks/use-pools'
import { useChainsStore } from '@/stores/use-chains-store'
import { PosterImages } from '@/components/poster-images'
import { TokenLinks } from './token-links'
import { AvatarCard } from '@/components/avatar-card'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { tokenInfo, isLoadingTokenInfo, isNotFound } = useTokenContext()
  const { isCopied, copy } = useClipboard()
  const { isMobile } = useResponsive()
  const { isGrauated } = usePools(tokenInfo?.address)
  const { findChain } = useChainsStore()
  const chain = findChain(tokenInfo?.chain?.name)

  if (isLoadingTokenInfo) {
    return (
      <>
        <div className={cn('flex gap-3 items-start mt-4', className)}>
          <Skeleton className="w-36 h-36 shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="w-1/2 h-5" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
        </div>
        <Skeleton className="w-full h-5 mt-3 rounded-full" />
        <Skeleton className="w-full h-3 mt-2 mb-1" />
        <Skeleton className="w-full h-3 mb-1" />
        <Skeleton className="w-2/3 h-3" />
        <div className="mt-5">
          <h3 className="font-bold text-base text-black">{t('ca')}:</h3>
          <Skeleton className="w-full h-3 mt-1" />
        </div>
      </>
    )
  }

  return (
    <AvatarCard
      src={tokenInfo?.image}
      className="mt-20"
      avatarChildren={
        isGrauated && (
          <Badge
            variant="success"
            className="absolute -bottom-14 left-1/2 -translate-x-1/2 border-black"
          >
            {t('token.graduated')}
          </Badge>
        )
      }
    >
      {/* Chain logo */}
      <div className="absolute left-2 top-2 flex items-center gap-1">
        <Avatar src={chain?.logo} size={20} />
        <p className="text-sm max-w-20 break-all">{chain?.displayName}</p>
      </div>

      {/* Name/symbol */}
      <div className="font-bold leading-none text-center pt-16">
        {isNotFound
          ? t('token.not-found')
          : `${tokenInfo?.name}(${tokenInfo?.ticker})`}
      </div>

      {/* Links */}
      <TokenLinks />

      {/* Poster */}
      <PosterImages poster={tokenInfo?.poster} className="mt-2" />

      {/* Description */}
      <div className={cn('text-sm mt-1 break-all cursor-pointer')}>
        {tokenInfo?.desc}
      </div>

      {/* Contract address */}
      {!isMobile && !isNotFound && (
        <div
          className="text-sm flex items-center cursor-pointer my-3"
          onClick={() => copy(tokenInfo?.address || '')}
        >
          <span>{t('ca')}:</span>
          <span className="truncate mx-2">
            {fmt.addr(tokenInfo?.address || '', { len: 12 })}
          </span>
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </div>
      )}

      {/* Bonding curve description */}
      {isNotFound ? (
        <p className="text-xs text-zinc-500 max-sm:mt-2">
          {t('token.not-found-desc')}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 max-sm:mt-2">
          {isGrauated
            ? t('token.graduated-desc')
            : utilLang.replace(t('bonding-curve.desc'), [
                BigNumber(LISTED_MARKET_CAP).toFormat(),
              ])}
        </p>
      )}
    </AvatarCard>
  )
}

export default TokenInfo
