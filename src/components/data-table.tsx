import { type ComponentProps, type ReactNode } from 'react'
import {
  flexRender,
  type Table as ITable,
  type RowData,
} from '@tanstack/react-table'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { linkStyle } from '@/styles/variants/link'
import { Skeleton } from './ui/skeleton'

interface Props<T extends RowData> extends ComponentProps<typeof Table> {
  table: ITable<T>
  total?: number
  disabled?: boolean
  isLoading?: boolean
  noData?: ReactNode
  skeleton?: ReactNode
  onFetchNext?: () => void
}

export const DataTable = <T extends RowData>({
  table,
  total = 0,
  disabled = false,
  isLoading = false,
  noData,
  skeleton,
  onFetchNext,
  containerClass,
  ...props
}: Props<T>) => {
  const { t } = useTranslation()
  const ths = table.getFlatHeaders()
  const rows = table.getRowModel().rows
  const cols = table.getAllColumns()

  const renderBody = () => {
    if (isLoading) return skeleton ?? <DataTableSkeleton colSpan={ths.length} />

    if (isEmpty(rows)) {
      return (
        <TableRow>
          <TableCell
            colSpan={cols.length}
            className="h-24 text-center text-zinc-500"
          >
            {noData ?? t('no.data')}
          </TableCell>
        </TableRow>
      )
    }

    return rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-3">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <>
      <Table
        containerClass={cn(
          'flex-1 bg-white rounded',
          disabled && 'opacity-50 select-none',
          containerClass
        )}
        {...props}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
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
        <TableBody>{renderBody()}</TableBody>
        {rows.length < total && (
          <TableFooter className="bg-transparent text-center">
            <TableRow
              onClick={() => {
                if (disabled) return
                onFetchNext?.()
              }}
            >
              <TableCell
                colSpan={ths.length}
                className={linkStyle(
                  'text-blue-600 font-normal',
                  disabled && 'text-zinc-500'
                )}
              >
                {t('view-more')}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  )
}

const DataTableSkeleton = ({
  className,
  colSpan = 1,
  ...props
}: ComponentProps<'td'>) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: colSpan }).map(() => (
        <TableCell className={cn('text-center', className)} {...props}>
          <Skeleton className="w-full h-6" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export default DataTable