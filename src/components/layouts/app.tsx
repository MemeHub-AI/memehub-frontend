import React, { type ComponentProps } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Header } from '../header'
import { Footer } from '../footer'
import { useMounted } from '@/hooks/use-mounted'
import { useLang } from '@/hooks/use-lang'
import { useUserInfo } from '@/hooks/use-user-info'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export const AppLayout = ({ children }: ComponentProps<'div'>) => {
  const { isNotMounted } = useMounted(onMounted)
  const { initLang } = useLang()

  function onMounted() {
    initLang()
  }

  // Auto login if `token` is already exists.
  useUserInfo()

  if (isNotMounted) return <></>

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default AppLayout
