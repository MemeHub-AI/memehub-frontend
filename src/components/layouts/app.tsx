import React, { useEffect, type ComponentProps } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { Header } from '../header'
import { Footer } from '../footer'
import { useMounted } from '@/hooks/use-mounted'
import { useLang } from '@/hooks/use-lang'
import { useUserInfo } from '@/hooks/use-user-info'
import { Toaster } from '@/components/ui/sonner'
import { BackToTop } from '../back-to-top'
import { useQueryChains } from '@/hooks/use-query-chains'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale(dayjsZh)
dayjs.locale(dayjsEn)

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const AppLayout = ({ children }: ComponentProps<'div'>) => {
  const { i18n } = useTranslation()
  const { isNotMounted } = useMounted()

  useLang() // init lang

  useQueryChains() // init chains

  useUserInfo() // init login

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? dayjsZh : dayjsEn)
  }, [i18n.language])

  if (isNotMounted) return <></>

  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
      <Toaster theme="light" richColors />
      <BackToTop />
    </>
  )
}

export default AppLayout
