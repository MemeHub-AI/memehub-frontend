import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowLeftRight } from 'lucide-react'
import { useRouter } from 'next/router'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useTradeRecord } from '../hooks/use-trade-record'
import { TradeType } from '@/api/websocket/types'
import { Routes } from '@/routes'

export const TradeTable = () => {
  const { t } = useTranslation()
  const [showAge, setShowAge] = useState(true)
  const router = useRouter()
  const ths = [
    t('account'),
    t('type'),
    t('amount'),
    t('volume'),
    showAge ? t('age') : t('date'),
    t('tx.hash'),
  ]
  const { tradeRecords } = useTradeRecord()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {ths.map((t, i) => (
            <TableHead key={i} className={cn(i === 0 && 'w-[100px]')}>
              {/* Date field */}
              {i === ths.length - 2 ? (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-black"
                  onClick={() => setShowAge(!showAge)}
                >
                  <span>{t}</span>
                  <ArrowLeftRight size={12} />
                </div>
              ) : (
                t
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradeRecords.map((r, i) => {
          const isBuy = r.type === TradeType.Buy
          return (
            <TableRow key={i}>
              <TableCell
                className="font-bold inline-flex items-center gap-1 cursor-pointer hover:underline my-2"
                onClick={() => {
                  router.push(`${Routes.Account}/${r.account.wallet_address}`)
                }}
              >
                <Avatar
                  src={r.account.logo}
                  size={24}
                  fallback={r.account.name.charAt(0)}
                />
                <span>{r.account.name.slice(-4)}</span>
              </TableCell>
              <TableCell
                className={cn(isBuy ? 'text-green-500' : 'text-red-500')}
              >
                {isBuy ? t('trade.buy') : t('trade.sell')}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                {fmt.tradeFixed(r.quote_amount)} {r.quote_symbol}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                {fmt.tradeFixed(r.base_amount)} {r.base_symbol}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                {showAge
                  ? dayjs.unix(+r.create_time).fromNow()
                  : dayjs.unix(+r.create_time).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                <Link
                  href={r.hash_url}
                  target="_blank"
                  className="hover:underline"
                >
                  {fmt.addr(r.hash)}
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={ths.length}>
            {/* <Pagination total={tradeRecords.length} onPageChange={setPage} /> */}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TradeTable
