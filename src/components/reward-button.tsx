import React, { type ComponentProps, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Countup from 'react-countup'

import { Button } from './ui/button'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'
import { DiamondIcon } from './diamond-icon'
import { useUserStore } from '@/stores/use-user-store'
import { UserIcon } from './user-icon'
import { useHeaderStore } from '@/stores/use-header-store'
import { useResponsive } from '@/hooks/use-responsive'

interface RewardButtonProps extends ComponentProps<typeof Button> {
  showReferral?: boolean
}

export const RewardButton = React.forwardRef<
  HTMLButtonElement,
  RewardButtonProps
>((props, ref) => {
  const { showReferral = true, className, ...restProps } = props
  const { t } = useTranslation()
  const { userInfo, oldUserInfo } = useUserStore()
  const { setDiamondEl } = useHeaderStore()
  const { isMobile } = useResponsive()

  const diamondRef = useRef<HTMLImageElement>(null)
  const router = useRouter()

  const totalIvite = useMemo(() => {
    const amount1 = userInfo?.inviter_count.one ?? 0
    const amount2 = userInfo?.inviter_count.two ?? 0
    return amount1 + amount2
  }, [userInfo])

  useEffect(() => {
    if (!diamondRef.current) return
    setDiamondEl(diamondRef.current)
  }, [diamondRef.current])

  if (userInfo?.id == null) {
    return <></>
  }

  const getMoney = () => {
    const money = userInfo?.reward_amount.toString()
    if (money.length > 4) {
      return money.substring(0, 4) + '...'
    } else {
      return money
    }
  }

  return (
    <Button
      variant="outline"
      className={cn(
        'bg-lime-green text-blue-deep hover:bg-lime-500 font-bold select-none',
        className
      )}
      onClick={() => router.push(Routes.Reward)}
      ref={ref}
      size={isMobile ? 'sm' : 'default'}
      {...restProps}
    >
      {showReferral && (
        <div className="flex items-center mr-2">
          <UserIcon size={20} className="mr-1" />
          {totalIvite ? totalIvite : t('referral')}
        </div>
      )}
      <div className="flex items-center">
        <DiamondIcon size={20} ref={diamondRef} className="mr-1" />
        {userInfo?.reward_amount ? (
          <Countup
            decimals={0}
            start={oldUserInfo?.reward_amount}
            end={userInfo?.reward_amount}
          ></Countup>
        ) : showReferral ? (
          t('rewards')
        ) : (
          t(getMoney())
        )}
      </div>
    </Button>
  )
})

export default RewardButton
