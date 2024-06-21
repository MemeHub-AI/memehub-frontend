import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from './ui/button'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'
import { DiamondIcon } from './diamond-icon'
import { useUserStore } from '@/stores/use-user-store'

interface RewardButtonProps extends ComponentProps<typeof Button> {
  showReferral?: boolean
}

export const RewardButton = React.forwardRef<
  HTMLButtonElement,
  RewardButtonProps
>((props, ref) => {
  const { showReferral = false, className, ...restProps } = props
  const { t } = useTranslation()
  const router = useRouter()
  const { userInfo } = useUserStore()

  return (
    <Button
      variant="outline"
      className={cn(
        'bg-lime-green text-blue-deep hover:bg-lime-500 font-bold gap-2 select-none',
        className
      )}
      onClick={() => router.push(Routes.Reward)}
      ref={ref}
      {...restProps}
    >
      {showReferral && <div>🧑‍🚀 {t('referral')}</div>}
      <div className="flex items-center gap-1">
        <DiamondIcon size={20} />
        {userInfo?.reward_amount ? (
          <span>{userInfo?.reward_amount}</span>
        ) : (
          <span>{t('rewards')}</span>
        )}
      </div>
    </Button>
  )
})

export default RewardButton
