import { useEffect } from 'react'
import { useChainId } from 'wagmi'

import { useUserStore } from '@/stores/use-user-store'
import { useNftCheck } from './use-nft-check'

export const useUserId = () => {
  const { setIsKol, setHasCommunity, setKolInfo, setCommunityInfo } =
    useUserStore()
  const chainId = useChainId()
  const { isKol, hasCommunity, kol, community } = useNftCheck(chainId)

  useEffect(() => {
    setIsKol(isKol)
    setHasCommunity(hasCommunity)
    setKolInfo(kol)
    setCommunityInfo(community || null)
  }, [isKol, hasCommunity, kol, community])

  return {
    isKol,
    hasCommunity,
    kol,
    community,
  }
}
