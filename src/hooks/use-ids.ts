import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'

export const useIds = () => {
  const { setUserIdentity, userInfo } = useUserStore()
  const { data } = useQuery({
    queryKey: [airdropApi.getIdentityList.name, userInfo?.id],
    queryFn: async () => {
      if (userInfo?.id == null) return Promise.reject()

      const { data } = await airdropApi.getIdentityList()
      return data
    },
    enabled: false,
  })
  const ids = data
  useEffect(() => {
    if (ids) {
      setUserIdentity(ids)
    }
  }, [ids])

  return {
    ids,
  }
}
