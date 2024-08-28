import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { zeroAddress, zeroHash } from 'viem'

import { Routes } from '@/routes'

export const useZeroFallback = (path = Routes.NotFound) => {
  const { query, ...router } = useRouter()

  useEffect(() => {
    const addr = query.address || query.id
    const hash = query.hash
    if (addr !== zeroAddress && hash !== zeroHash) return

    router.push(path)
  }, [query])
}
