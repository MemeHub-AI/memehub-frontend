import { type ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import dayjs from 'dayjs'

import { RewardItem } from '@/api/invite/types'
import { Img } from '@/components/img'
import { DiamondIcon } from '@/components/diamond-icon'
import { fmt } from '@/utils/fmt'
import { useChainInfo } from '@/hooks/use-chain-info'
import { RewardInfoRes } from '@/api/reward/types'

enum RewardType {
  Token = 1,
  Diamond,
}

const rewardSourceMap: Record<keyof RewardInfoRes, string> = {
  buy: t('reward.buy'),
  sell: t('reward.sell'),
  create: t('reward.create'),
  graduated: t('reward.graduated'),
  join_community: t('reward.join-community'),
  memex_created: t('reward.memex-create'),
  memex_launched: t('reward.memex-launched'),
  memex_liked: t('reward.memex-liked'),
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
  {
    header: t('reward.source'),
    accessorKey: 'flag',
    cell: ({ row }) =>
      rewardSourceMap[row.original.flag] || t('reward.unknown'),
  },
]
