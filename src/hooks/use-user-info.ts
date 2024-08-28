import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/api/user'
import { useLocalStorage } from './use-storage'
import { useUserStore } from '@/stores/use-user-store'

export const useUserInfo = (addr?: string) => {
  const { setUserInfo } = useUserStore()
  const { getStorage } = useLocalStorage()
  const token = getStorage('token')

  // Query other user info.
  const {
    data: otherUserInfo,
    isFetching: isFetchingOtherUserInfo,
    refetch: refetchOtherUserInfo,
  } = useQuery({
    queryKey: [userApi.getOtherInfo.name, addr],
    queryFn: () => userApi.getOtherInfo(addr!),
    enabled: !!addr,
  })

  // Query my info.
  const {
    data: userInfo,
    isFetching: isFetchingUserInfo,
    refetch: refetchUserInfo,
  } = useQuery({
    queryKey: [userApi.getInfo.name, token],
    queryFn: () => userApi.getInfo(),
    enabled: !!token,
  })

  // Update latest user info if it's not null.
  useEffect(() => {
    if (!userInfo?.data) return
    setUserInfo(userInfo.data)
  }, [userInfo])

  return {
    userInfo: userInfo?.data,
    otherUserInfo: otherUserInfo?.data,
    isFetchingUserInfo,
    isFetchingOtherUserInfo,
    refetchUserInfo,
    refetchOtherUserInfo,
  }
}
