import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useTokenContext } from '@/contexts/token'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { current, total } = useTokenContext()
  const percent = BigNumber(current).div(total).multipliedBy(100).toFixed(3)

  return (
    <div className={cn('mt-4', className)}>
      {/* Token intro */}
      <div className="flex gap-2 items-start">
        <Dialog>
          <DialogTrigger asChild>
            <img
              src="/images/meme.png"
              alt="logo"
              className="w-32 object-contain rounded cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="p-0" showClose={false}>
            <img
              src="/images/meme.png"
              alt="logo"
              className="w-full object-contain"
            />
          </DialogContent>
        </Dialog>
        <div>
          <div className="font-bold leading-none">MemeHub(MHUB)</div>
          <div className="text-xs text-gray-400 mt-1">description...</div>
        </div>
      </div>

      {/* Bonding curve progress */}
      <div className="my-3">
        <div className="text-sm mb-1">{t('progress.bonding-curve')}:</div>
        <Progress
          className="h-4"
          indicatorClass="bg-blue-600"
          labelClass="text-white"
          value={Number(percent)}
          label={percent}
        />
        <div className="text-zinc-400 text-xs mt-1">
          {t('bonding-curve.token')
            .replace('{}', '100$')
            .replace('{}', 'DEXTools')}{' '}
          <br />
        </div>
      </div>

      {/* <HoldersRank /> */}
    </div>
  )
}

export default TokenInfo
