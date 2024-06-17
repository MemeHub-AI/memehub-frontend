import React from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'

const rows = [
  {
    name: 'L1en',
    earned: '0.23 ETH',
    time: '2022-08-01 12:00:00',
  },
  {
    name: 'L1en',
    earned: '1.23 ETH',
    time: '2022-08-02 11:00:00',
  },
  {
    name: 'L1en',
    earned: '10.23 ETH',
    time: '2022-08-03 12:30:00',
  },
]

export const InviteTable = () => {
  const { t } = useTranslation()

  const ths = [t('reward.earned'), t('reward.time'), t('reward.username')]

  return (
    <Table containerClass="border-2 border-black rounded-md mt-4 w-3/5 px-2">
      <TableHeader>
        <TableRow className="!border-b-2 border-b-zinc-300">
          {ths.map((t, i) => (
            <TableHead key={i} className="pl-6 text-black font-bold">
              {t}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => {
          return (
            <TableRow
              key={i}
              className="border-b-zinc-300 !border-b-2 last:!border-b-0 "
            >
              <TableCell className="pl-6">{r.earned}</TableCell>
              <TableCell className="pl-6">{r.time}</TableCell>
              <TableCell className="pl-6">{r.name}</TableCell>
            </TableRow>
          )
        })}
        {isEmpty(rows) && (
          <tr>
            <td colSpan={ths.length} className="text-zinc-400 text-center py-4">
              {t('no.earned')}
            </td>
          </tr>
        )}
      </TableBody>
      <TableFooter className="bg-transparent text-center">
        <TableRow>
          <TableCell
            colSpan={ths.length}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {t('view-more')}...
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default InviteTable
