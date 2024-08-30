import { useState } from 'react'

import { useLocalStorage } from '@/hooks/use-storage'
import { strToBool } from '@/utils'
import { useTokenContext } from '@/contexts/token'
import { DataTable } from '@/components/data-table'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { tradeColumns } from './trade-columns'
import { TokenWsTrade } from '../hooks/use-token-ws/types'

const empty = [] as TokenWsTrade[]

export const TradeTable = () => {
  const { getStorage, setStorage } = useLocalStorage()
  const [showAge, setShowAge] = useState(strToBool(getStorage('show_age')))
  const { tradeRecords, hasMoreTrades, fetchNextTrades } = useTokenContext()

  const table = useReactTable({
    data: tradeRecords ?? empty,
    columns: tradeColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      showAge,
      setShowAge: () => {
        setShowAge(!showAge)
        setStorage('show_age', String(!showAge))
      },
    },
  })

  return (
    <DataTable
      containerClass="border-2 border-black rounded-md"
      bodyRowClass="h-12"
      table={table}
      hasMore={hasMoreTrades}
      onFetchNext={fetchNextTrades}
    />
  )
}

export default TradeTable
