import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCheckmark } from 'react-icons/io5'
import { MdContentCopy } from 'react-icons/md'

import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenProgress } from './token-progress'
import { Avatar } from '@/components/ui/avatar'
import { useClipboard } from '@/hooks/use-clipboard'
import { useResponsive } from '@/hooks/use-responsive'
import { useMarketCap } from '@/hooks/use-market-cap'

export const TokenInfoHeader = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const {
    tokenInfo,
    isLoadingTokenInfo,
    isNotFound,
    isIdoToken,
    tokenMetadata,
    tokenChain,
  } = useTokenContext()
  const { isCopied, copy } = useClipboard()
  const { isMobile } = useResponsive()
  const { marketCap } = useMarketCap()

  const tokenLabelName = `${tokenInfo?.name ?? tokenMetadata?.name}(${
    tokenInfo?.symbol ?? tokenMetadata?.symbol
  })`

  if (isLoadingTokenInfo) {
    return (
      <div className="flex items-center justify-between gap-4 px-1 text-sm mb-1">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-28 h-5" />
      </div>
    )
  }

  return (
    <div className="flex items-center max-sm:flex-col max-sm:items-start mb-1 max-sm:gap-1">
      <div
        className={cn(
          'max-sm:w-full flex items-center justify-between gap-1 text-sm max-sm:mb-1 max-sm:mt-0 max-sm:flex-col max-sm:items-start',
          className
        )}
      >
        <div className="max-sm:flex max-sm:w-full max-sm:justify-between max-sm:space-x-2">
          <div className="flex items-center max-w-64 break-all line-clamp-1 max-sm:flex-1">
            <Avatar
              src={tokenInfo?.image_url ?? ''}
              size={26}
              className="border-2 border-black"
            />

            <span
              className="ml-1 font-bold text-blue-600 truncate"
              title={tokenLabelName}
            >
              {isNotFound && !isIdoToken && !tokenMetadata
                ? t('token.not-found')
                : tokenLabelName}
            </span>
          </div>
          <div className="sm:hidden flex items-center">
            <img
              src={tokenChain?.logo}
              alt={tokenChain?.displayName}
              className="w-5 h-5 rounded"
            />
            <span className="ml-1 whitespace-nowrap">
              {fmt.withChain(tokenChain?.displayName)}
            </span>
          </div>
        </div>
        <span>
          <span className="font-bold">{t('market-cap')}: </span>$
          {fmt.decimals(marketCap)}
        </span>

        {isMobile && (
          <div
            className="text-sm flex items-center space-x-2 cursor-pointer"
            onClick={() => copy(tokenInfo?.contract_address || '')}
          >
            <span>{t('ca')}:</span>
            <span className="truncate">
              {fmt.addr(tokenInfo?.contract_address || '', { len: 14 })}
            </span>
            <span>
              {isCopied ? (
                <IoCheckmark size={16} />
              ) : (
                <MdContentCopy size={16} />
              )}
            </span>
          </div>
        )}
      </div>
      <TokenProgress className="ml-2 w-full max-sm:ml-0" showDesc={false} />
    </div>
  )
}

export default TokenInfoHeader
