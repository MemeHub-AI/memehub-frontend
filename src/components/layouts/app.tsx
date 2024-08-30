import { type ReactNode } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BigNumber } from 'bignumber.js'

import { useLang } from '@/hooks/use-lang'
import { useUserInfo } from '@/hooks/use-user-info'
import { useQueryChains } from '@/hooks/use-query-chains'
import { useMounted } from '@/hooks/use-mounted'
import { Toaster } from '@/components/ui/sonner'
import { BackToTop } from '@/components/back-to-top'
import { SignLoginDialog } from '../sign-login-dialog'
import { useUserId } from '@/hooks/use-user-id'
import { MaintainTips } from '../maintain-tips'
import { useKeepReferralCode } from '@/hooks/use-keep-referral-code'

// Extends style css variable for react
declare module 'react' {
  interface CSSProperties {
    [k: `--${string}`]: string | number
  }
}

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale(dayjsZh)
dayjs.locale(dayjsEn)

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isNotMounted } = useMounted()

  useLang() // init lang

  useUserInfo() // init login

  useQueryChains() // init chains

  useUserId() // init user identify

  useKeepReferralCode() // keep referral code query

  if (isNotMounted) return

  return (
    <>
      <MaintainTips />
      {children}
      <Toaster theme="light" richColors />
      <BackToTop />
      <SignLoginDialog />
    </>
  )
}

export default AppLayout
