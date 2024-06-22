import React from 'react'
import { useTranslation } from 'react-i18next'

import { AirdropCard } from '@/views/airdrop/components/card'
import { useAirdrop } from '../hooks/v2/use-airdrop'
import { cn } from '@/lib/utils'

export const TradeAirdrop = () => {
  const { t } = useTranslation()
  const {} = useAirdrop()

  return (
    <div
      className={cn(
        'mt-2.5 flex items-center justify-between gap-4',
        'border-2 border-black rounded-lg relative'
      )}
    >
      <h2 className="absolute left-3 top-3 font-bold text-lg">
        {t('airdrop')}
      </h2>

      <AirdropCard
        airdrop={undefined}
        className="flex-1 border-none mt-6"
        isTradePage
      />
      <AirdropCard
        airdrop={undefined}
        className="flex-1 border-none"
        isTradePage
      />
    </div>
  )
}

export default TradeAirdrop
