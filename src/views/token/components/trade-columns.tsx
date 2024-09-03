import { type RowData, type ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'
import { AiOutlineSwap } from 'react-icons/ai'
import { zeroAddress } from 'viem'

import { type TokenWsTrade } from '../hooks/use-token-ws/types'
import { joinPaths } from '@/utils'
import { fmt } from '@/utils/fmt'
import { linkStyle } from '@/styles/variants/link'
import { TradeType } from '@/enums/trade'
import { cn } from '@/lib/utils'
import { useChainInfo } from '@/hooks/use-chain-info'
import { formatFromTz } from '@/utils/day'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    showAge: boolean
    setShowAge: () => void
  }
}

export const tradeColumns: ColumnDef<TokenWsTrade>[] = [
  {
    accessorKey: 'executor',
    header: () => t('account'),
    cell: ({ row }) => {
      const { executor } = row.original
      const isZeroAddr = executor === zeroAddress
      const router = useRouter()

      return (
        <span
          className={isZeroAddr ? 'font-bold' : linkStyle('font-bold')}
          onClick={() => {
            if (isZeroAddr) return
            router.push(joinPaths(Routes.Account, executor))
          }}
        >
          {fmt.addr(executor)}
        </span>
      )
    },
  },
  {
    accessorKey: 'type',
    header: () => t('type'),
    cell: ({ row }) => {
      const isBuy = row.original.type === TradeType.Buy
      return (
        <span className={cn(isBuy ? 'text-green-500' : 'text-red-500')}>
          {isBuy ? t('trade.buy') : t('trade.sell')}
        </span>
      )
    },
  },
  {
    accessorKey: 'base_amount',
    header: () => t('amount'),
    cell: ({ row }) => {
      const { base_amount, base_symbol } = row.original

      return (
        <span>
          {fmt.decimals(base_amount, { round: true })}{' '}
          {fmt.ellipsis(base_symbol)}
        </span>
      )
    },
  },
  {
    accessorKey: 'quote_amount',
    header: () => t('volume'),
    cell: ({ row }) => {
      const { quote_amount, quote_symbol } = row.original
      return (
        <span>
          {fmt.decimals(quote_amount, { round: true, fixed: 4 })} {quote_symbol}
        </span>
      )
    },
  },
  {
    accessorKey: 'usd_price',
    header: 'USD',
    cell: ({ row: { original } }) => {
      return (
        <span>
          $
          {fmt.decimals(
            BigNumber(original.usd_price)
              .div(original.price)
              .multipliedBy(original.quote_amount)
              .toFixed(),
            { round: true }
          )}
        </span>
      )
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ table }) => {
      const { showAge, setShowAge } = table.options.meta ?? {}
      return (
        <div
          className="inline-flex items-center space-x-1 cursor-pointer w-36"
          onClick={setShowAge}
        >
          <span>{showAge ? t('age') : t('date')}</span>
          <AiOutlineSwap />
        </div>
      )
    },
    cell: ({ row: { original }, table }) => {
      const { showAge } = table.options.meta ?? {}
      return (
        <span>
          {showAge
            ? dayjs(original.timestamp).fromNow()
            : formatFromTz(original.timestamp)}
        </span>
      )
    },
  },
  {
    accessorKey: 'hash',
    header: () => t('tx.hash'),
    cell: ({ row: { original } }) => {
      const { chain } = useChainInfo(original.chain)
      return (
        <Link
          href={`${chain?.explorer}/tx/${original.hash}`}
          target="_blank"
          className={linkStyle()}
        >
          {fmt.addr(original.hash)}
        </Link>
      )
    },
  },
]
