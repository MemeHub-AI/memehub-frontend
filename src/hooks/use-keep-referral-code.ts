import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useSessionStorage } from './use-storage'

export const useKeepReferralCode = () => {
  const { query, ...router } = useRouter()
  const { getStorage, setStorage } = useSessionStorage()

  useEffect(() => {
    if (!router.isReady) return
    setStorage('invite_code', (query.r || '') as string)
  }, [router.isReady])

  useEffect(() => {
    const code = getStorage('invite_code')
    const url = new URL(location.href)
    if (!code || !!url.searchParams.get('r')) return

    url.searchParams.set('r', code)
    router.replace(url.toString(), undefined, { shallow: true })
  }, [router])
}
