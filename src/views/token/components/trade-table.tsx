import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowLeftRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useTradeRecord } from '../hooks/use-trade-record'
import { Routes } from '@/routes'
import { useStorage } from '@/hooks/use-storage'
import { strToBool } from '@/utils/convert'
import { utilLang } from '@/utils/lang'
import { TradeType } from '@/constants/trade'
import { Pagination } from '@/components/ui/pagination'

export const TradeTable = () => {
  const { t, i18n } = useTranslation()
  const { getTableShowAge, setTableShowAge } = useStorage()

  const [showAge, setShowAge] = useState(strToBool(getTableShowAge()))
  const router = useRouter()
  const ths = [
    t('account'),
    t('type'),
    t('price'),
    t('amount'),
    t('volume'),
    showAge ? t('age') : t('date'),
    t('tx.hash'),
  ]
  const { tradeRecords, hasMore, fetchNextPage } = useTradeRecord()

  const formatFromTz = (ts: number) => {
    const date = dayjs.unix(ts)
    return utilLang.isEn(i18n)
      ? date.utc().format('YYYY-MM-DD HH:mm:ss')
      : date.format('YYYY-MM-DD HH:mm:ss')
  }

  return (
    <>
      <Table containerClass="border-2 border-black rounded-md">
        <TableHeader>
          <TableRow className="!border-b-2 border-b-black">
            {ths.map((t, i) => (
              <TableHead
                key={i}
                className={cn('px-2 text-nowrap whitespace-nowrap')}
              >
                {/* Date field */}
                {i === ths.length - 2 ? (
                  <div
                    className="flex items-center cursor-pointer hover:text-black"
                    onClick={() => {
                      setShowAge(!showAge)
                      setTableShowAge(String(!showAge))
                    }}
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
              <TableRow
                key={i}
                className="border-b-black !border-b-2 last:!border-b-0"
              >
                <TableCell
                  className="font-bold inline-flex items-center cursor-pointer hover:underline my-2 px-3"
                  onClick={() => {
                    router.push(`${Routes.Account}/${r.account.wallet_address}`)
                  }}
                >
                  <Avatar
                    src={r.account.logo}
                    size={24}
                    fallback={r.account.name.charAt(0)}
                  />
                  <span className="ml-1 max-w-20 truncate">
                    {r.account.name}
                  </span>
                </TableCell>
                <TableCell
                  className={cn(isBuy ? 'text-green-500' : 'text-red-500')}
                >
                  {isBuy ? t('trade.buy') : t('trade.sell')}
                </TableCell>
                <TableCell className="max-sm:text-xs">
                  ${fmt.decimals(r.usd_price, { round: true })}
                </TableCell>
                <TableCell className="max-sm:text-xs">
                  {fmt.decimals(r.base_amount, { round: true })} {r.base_symbol}
                </TableCell>
                <TableCell className="max-sm:text-xs">
                  {fmt.decimals(r.quote_amount, { round: true })}{' '}
                  {r.quote_symbol}
                </TableCell>
                <TableCell className="max-sm:text-xs w-48">
                  {showAge
                    ? dayjs.unix(+r.create_time).fromNow()
                    : formatFromTz(+r.create_time)}
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
          {isEmpty(tradeRecords) && (
            <tr>
              <td
                colSpan={ths.length}
                className="text-zinc-400 text-center py-[4.45rem]"
              >
                {t('no.trade')}
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
      <div
        className={cn(
          'text-center mt-1 cursor-pointer',
          hasMore ? 'text-blue-500 underline' : 'text-zinc-500'
        )}
        onClick={fetchNextPage}
      >
        {hasMore ? t('loading.more') : t('nomore')}
      </div>
    </>
  )
}

export default TradeTable
