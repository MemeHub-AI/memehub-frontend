import React, { type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BigNumber } from 'bignumber.js'

import { qs } from '@/hooks/use-fetch'
import { useStorage } from '@/hooks/use-storage'
import { useLang } from '@/hooks/use-lang'
import { useUserInfo } from '@/hooks/use-user-info'
import { useQueryChains } from '@/hooks/use-query-chains'
import { useMounted } from '@/hooks/use-mounted'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { BackToTop } from '@/components/back-to-top'
import { SignLoginDialog } from '../sign-login-dialog'
import { useUserId } from '@/hooks/use-user-id'
import { useIsMemex } from '@/hooks/use-is-memex'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale(dayjsZh)
dayjs.locale(dayjsEn)

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()
  const { getInviteCode, setInviteCode } = useStorage()
  const { query, ...router } = useRouter()
  const { isNotMounted } = useMounted()
  const { isMemex } = useIsMemex()

  const handleRouteChange = (url: string) => {
    const code = getInviteCode()

    if (code && !/(\?|&)r=/.test(location.search)) {
      const url = new URL(location.origin + location.pathname)
      const query = qs.parse(location.search)
      Object.keys(query).forEach((key) => {
        url.searchParams.set(key, query[key])
      })
      url.searchParams.set('r', code)
      router.replace(url.toString(), undefined, { shallow: true })
    }
    router.events.off('routeChangeComplete', handleRouteChange)
  }

  useLang() // init lang

  useUserInfo() // init login

  useQueryChains() // init chains

  useUserId() // init user identify

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? dayjsZh : dayjsEn)
  }, [i18n.language])

  useEffect(() => {
    const inviteCode = location.search.match(/r=([^&]+)*/)?.[1] ?? ''

    setInviteCode(inviteCode)
    router.events.on('routeChangeStart', () => {
      router.events.on('routeChangeComplete', handleRouteChange)
    })
  }, [])

  if (isNotMounted) return

  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
      <Toaster theme="light" richColors />
      <BackToTop />
      <SignLoginDialog />
    </>
  )
}

export default AppLayout
