import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useStorage } from './use-storage'

export const useKeepReferralCode = () => {
  const { query, ...router } = useRouter()
  const { getInviteCode, setInviteCode } = useStorage(true)

  useEffect(() => {
    if (!router.isReady) return
    setInviteCode((query.r || '') as string)
  }, [router.isReady])

  useEffect(() => {
    const code = getInviteCode()
    const url = new URL(location.href)
    if (!code || !!url.searchParams.get('r')) return

    url.searchParams.set('r', code)
    router.replace(url.toString(), undefined, { shallow: true })
  }, [router])
}
