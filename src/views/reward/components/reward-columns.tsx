import { type ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import dayjs from 'dayjs'

import { RewardItem } from '@/api/invite/types'
import { Img } from '@/components/img'
import { DiamondIcon } from '@/components/diamond-icon'
import { fmt } from '@/utils/fmt'
import { useChainInfo } from '@/hooks/use-chain-info'

enum RewardType {
  Token = 1,
  Diamond,
}

export const rewardTableCols: ColumnDef<RewardItem>[] = [
  {
    header: t('earned'),
    accessorKey: 'earned',
    cell: ({ row }) => {
      const { earned, category } = row.original
      const { chain } = useChainInfo(row.original.chain)

      return (
        <div className="flex items-center space-x-1">
          <span>{fmt.decimals(earned)}</span>
          {category === RewardType.Diamond ? (
            <DiamondIcon size={20} />
          ) : (
            <Img src={chain?.logo} alt="logo" className="w-5" />
          )}
        </div>
      )
    },
  },
  {
    header: t('time'),
    accessorKey: 'time',
    cell: ({ row }) => dayjs(row.original.time).format('YYYY-MM-DD HH:mm'),
  },
  {
    header: t('username'),
    accessorKey: 'username',
  },
]
