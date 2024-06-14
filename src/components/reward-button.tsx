import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from './ui/button'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<typeof Button> {
  showReferral?: boolean
}

export const RewardButton = ({
  showReferral = false,
  className,
  ...props
}: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className={cn(
        'bg-lime-300 text-blue-deep hover:bg-lime-500 font-bold gap-2',
        className
      )}
      onClick={() => router.push(Routes.Reward)}
      {...props}
    >
      {showReferral && <div>🧑‍🚀 {t('referral')}</div>}
      <div>💎 {t('diamond')}</div>
    </Button>
  )
}

export default RewardButton
