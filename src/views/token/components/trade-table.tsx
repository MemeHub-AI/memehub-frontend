import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import dayjs from 'dayjs'

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
import { Tooltip } from '@/components/ui/tooltip'
import { Avatar } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

enum Type {
  Buy,
  Sell,
}

const rows = Array.from({ length: 10 }).map(() => ({
  avatar: '/images/meme.png',
  name: 'L1en',
  type: Math.random() > 0.4 ? Type.Sell : Type.Buy,
  amount: '123',
  symbol: 'ETH',
  date: '2024/01/01 12:00',
  tx: '6WAPjM1VEEKnotkq6TGTgHywKdJLrLmuEWaDARX7SfzK9rrzmjxXfsGXjevMSJLxQHiuZHbW7LvjEuNKBvWvrBj',
  explorer:
    'https://scrollscan.com/token/0x5300000000000000000000000000000000000004',
}))

export const TradeTable = () => {
  const { t } = useTranslation()
  const ths = [t('account'), t('type'), t('amount'), t('date'), t('tx.hash')]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {ths.map((t, i) => (
            <TableHead key={i} className={cn(i === 0 && 'w-[100px]')}>
              {t}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => {
          const isBuy = r.type === Type.Buy
          return (
            <TableRow key={i}>
              <TableCell
                className="font-bold inline-flex items-center gap-1 cursor-pointer hover:underline my-2"
                onClick={() => {}}
              >
                <Avatar src={r.avatar} size={24} />
                <span>{r.name}</span>
              </TableCell>
              <TableCell
                className={cn(isBuy ? 'text-green-500' : 'text-red-500')}
              >
                {isBuy ? t('buy') : t('sell')}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                {r.amount} {r.symbol}
              </TableCell>
              <TableCell className="max-sm:text-xs">
                <Tooltip tip={dayjs(r.date).fromNow()}>{r.date}</Tooltip>
              </TableCell>
              <TableCell className="max-sm:text-xs">
                <Link
                  href={r.explorer}
                  target="_blank"
                  className="hover:underline"
                >
                  {fmt.addr(r.tx)}
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={ths.length}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TradeTable
