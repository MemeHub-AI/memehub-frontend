import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

import { userApi } from '@/api/user'
import { useStorage } from './use-storage'
import { useUserStore } from '@/stores/use-user-store'

export const useUserInfo = (id?: string) => {
  const { setUserInfo } = useUserStore()
  const { getToken } = useStorage()
  const token = getToken() || ''

  // Query other user info.
  const {
    data: otherUserInfo,
    isFetching: isFetchingOtherUserInfo,
    refetch: refetchOtherUserInfo,
  } = useQuery({
    queryKey: [userApi.getInfo.name, id],
    queryFn: () => {
      if (!id || isEmpty(id)) return Promise.reject()
      return userApi.getInfo(id)
    },
  })

  // Query my info.
  const {
    data: userInfo,
    isFetching: isFetchingUserInfo,
    refetch: refetchUserInfo,
  } = useQuery({
    queryKey: [userApi.getInfoFromToken.name, token],
    queryFn: () => {
      if (isEmpty(token)) return Promise.reject()
      return userApi.getInfoFromToken()
    },
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
