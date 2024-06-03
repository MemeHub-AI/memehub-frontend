import React, { useEffect, type ComponentProps } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjsZh from 'dayjs/locale/zh-cn'
import dayjsEn from 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { Header } from '../header'
import { Footer } from '../footer'
import { useMounted } from '@/hooks/use-mounted'
import { useLang } from '@/hooks/use-lang'
import { useUserInfo } from '@/hooks/use-user-info'
import { Toaster } from '@/components/ui/sonner'
import { BackToTop } from '../back-to-top'
import { chainApi } from '@/api/chain'
import { useChainsStore } from '@/stores/use-chains-store'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale(dayjsZh)
dayjs.locale(dayjsEn)

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const AppLayout = ({ children }: ComponentProps<'div'>) => {
  const { isNotMounted } = useMounted()
  const { initLang } = useLang()
  const { setChains } = useChainsStore()

  const { t, i18n } = useTranslation()

  const initChains = async () => {
    try {
      const { data } = await chainApi.getChain()
      setChains(data!)
    } catch (error) {
      toast.error(t('get.chain.error'))
    }
  }

  useEffect(() => {
    initLang()
    initChains()
  }, [])

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? dayjsZh : dayjsEn)
  }, [i18n.language])

  // Auto login if `token` is already exists.
  useUserInfo()

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
