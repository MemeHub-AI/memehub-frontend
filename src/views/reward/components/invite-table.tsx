import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { ColumnDef, flexRender } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { RewardItem } from '@/api/invite/types'
import { useChainsStore } from '@/stores/use-chains-store'
import { Img } from '@/components/img'
import { DiamondIcon } from '@/components/diamond-icon'
import { useRewardTable } from '../hooks/use-reward-table'
import { fmt } from '@/utils/fmt'

enum RewardType {
  Token = 1,
  Diamond,
}

export const InviteTable = ({ className }: ComponentProps<'h2'>) => {
  const { t } = useTranslation()
  const { findChain } = useChainsStore()

  const columns: ColumnDef<RewardItem>[] = [
    {
      header: t('earned'),
      accessorKey: 'earned',
      cell: ({ row }) => {
        const { chain, earned, category } = row.original
        return (
          <div className="flex items-center gap-1">
            <span>{fmt.decimals(earned)}</span>
            {category === RewardType.Diamond ? (
              <DiamondIcon size={20} />
            ) : (
              <Img src={findChain(chain)?.logo} alt="logo" className="w-5" />
            )}
          </div>
        )
      },
    },
    {
      header: t('time'),
      accessorKey: 'time',
    },
    {
      header: t('username'),
      accessorKey: 'username',
    },
  ]

  const { ths, rows, total, fetchNextPage } = useRewardTable(columns)

  return (
    <>
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.record')}
      </h2>
      <Table containerClass="border-2 border-black rounded-md px-2 w-4/5 2xl:w-3/5 w-full">
        <TableHeader>
          {ths.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-black px-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {isEmpty(rows) && (
            <tr>
              <td
                colSpan={ths[0]?.headers.length}
                className="text-zinc-400 text-center py-4"
              >
                {t('no.earned')}
              </td>
            </tr>
          )}
        </TableBody>
        {rows.length < total && (
          <TableFooter className="bg-transparent text-center">
            <TableRow onClick={() => fetchNextPage()}>
              <TableCell
                colSpan={ths[0]?.headers.length}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                {t('view-more')}...
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  )
}

export default InviteTable
