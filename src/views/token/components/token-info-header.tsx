import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Copy } from 'lucide-react'

import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'
import { useHoldersStore } from '@/stores/use-holders-store'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { BondingCurveProgress } from './bonding-curve-progress'
import { Avatar } from '@/components/ui/avatar'
import { useClipboard } from '@/hooks/use-clipboard'
import { useResponsive } from '@/hooks/use-responsive'
import { useChainsStore } from '@/stores/use-chains-store'

export const TokenInfoHeader = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { tokenInfo, isLoadingTokenInfo, isNotFound, isIdoToken } =
    useTokenContext()
  const { marketCap } = useHoldersStore()
  const { isCopied, copy } = useClipboard()
  const { isMobile } = useResponsive()
  const { chainsMap } = useChainsStore()

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
        <div className="max-sm:flex max-sm:w-full max-sm:justify-between">
          <div className="flex items-center">
            <Avatar
              src={tokenInfo?.image ?? ''}
              size={26}
              className="border-2 border-black"
            />

            <span className="ml-1 font-bold text-blue-600">
              {isNotFound && !isIdoToken
                ? t('token.not-found')
                : `${tokenInfo?.name}(${tokenInfo?.ticker})`}
            </span>
          </div>
          <div className="sm:hidden flex items-center">
            <img
              src={tokenInfo?.chain.logo}
              alt={tokenInfo?.chain.name}
              className="w-5 h-5 rounded"
            />
            <span className="ml-1">
              {fmt.withChain(chainsMap[tokenInfo?.chain.id ?? 0]?.displayName)}
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
            onClick={() => copy(tokenInfo?.address || '')}
          >
            <span>{t('ca')}:</span>
            <span className="truncate">
              {fmt.addr(tokenInfo?.address || '', { len: 14 })}
            </span>
            <span>{isCopied ? <Check size={16} /> : <Copy size={16} />}</span>
          </div>
        )}

        {/* Creator */}
        {/* <div className="flex items-center gap-1">
        <div className="mr-1 font-bold">{t('creator')}:</div>
        <img
          src={tokenInfo?.creator.logo || ''}
          className="h-5 w-5 rounded-md"
        />
        <span
          className="hover:underline cursor-pointer"
          onClick={() => {
            const href = fmt.toHref(
              Routes.Account,
              tokenInfo?.creator.wallet_address || ''
            )
            router.push(href)
          }}
        >
          {tokenInfo?.creator.name}
        </span>
      </div> */}
      </div>
      <BondingCurveProgress
        className="ml-2 w-full max-sm:ml-0"
        showDesc={false}
      />
    </div>
  )
}

export default TokenInfoHeader
