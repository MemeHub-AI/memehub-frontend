import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { IoCheckmark } from 'react-icons/io5'
import { MdContentCopy } from 'react-icons/md'

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
import { useChainsStore } from '@/stores/use-chains-store'
import { PosterImages } from '@/components/poster-images'
import { TokenSocialLinks } from '../../../components/token-links'
import { AvatarCard } from '@/components/avatar-card'

export const TokenInfoCard = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const {
    tokenInfo,
    isLoadingTokenInfo,
    isNotFound,
    isIdoToken,
    isGraduated,
    tokenMetadata,
    chainId,
  } = useTokenContext()
  const { isCopied, copy } = useClipboard()
  const { isMobile } = useResponsive()
  const { evmChainsMap } = useChainsStore()
  const chain = evmChainsMap[chainId]

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
        isGraduated && (
          <Badge
            variant="success"
            className="absolute -bottom-0 left-1/2 -translate-x-1/2 border-black"
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
      <div className="font-bold leading-none text-center mt-2">
        {isNotFound && !isIdoToken && !tokenMetadata
          ? t('token.not-found')
          : `${tokenInfo?.name ?? tokenMetadata?.name}(${
              tokenInfo?.ticker ?? tokenMetadata?.symbol
            })`}
      </div>

      {/* Links */}
      <TokenSocialLinks />

      {/* Poster */}
      <PosterImages poster={tokenInfo?.poster} className="mt-2" />

      {/* Description */}
      <div className={cn('text-sm mt-1 break-all cursor-pointer')}>
        {tokenInfo?.desc}
      </div>

      {/* Contract address */}
      {!isMobile && (!isNotFound || tokenMetadata) && (
        <div
          className="text-sm flex items-center cursor-pointer my-3"
          onClick={() => copy(tokenInfo?.address ?? tokenMetadata?.token ?? '')}
        >
          <span>{t('ca')}:</span>
          <span className="truncate mx-2">
            {fmt.addr(tokenInfo?.address ?? tokenMetadata?.token ?? '', {
              len: 12,
            })}
          </span>
          {isCopied ? <IoCheckmark size={16} /> : <MdContentCopy size={16} />}
        </div>
      )}

      {/* Bonding curve description */}
      {isIdoToken ? (
        <></>
      ) : isNotFound ? (
        <p className="text-xs text-zinc-500 max-sm:mt-2">
          {t('token.not-found-desc')}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 max-sm:mt-2">
          {isGraduated
            ? t('token.graduated-desc')
            : utilLang.replace(t('bonding-curve.desc'), [
                BigNumber(LISTED_MARKET_CAP).toFormat(),
              ])}
        </p>
      )}
    </AvatarCard>
  )
}

export default TokenInfoCard