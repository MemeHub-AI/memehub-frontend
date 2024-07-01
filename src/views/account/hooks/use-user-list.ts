import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { userApi } from '@/api/user'
import { UserListRes, UserListType } from '@/api/user/types'

type ListMap = {
  [K in UserListType]: {
    total: number
    list: UserListRes[K][]
  }
}

export const useUserList = (type: UserListType) => {
  // Why we need a map?
  // An error will occured when `AccountTab` change if use uniform `list`.
  // Because the new tab uses the old list data, it will cause data format errors.
  const [listMap, setListMap] = useState<ListMap>({
    [UserListType.CoinsHeld]: { total: 0, list: [] },
    [UserListType.CoinsCreated]: { total: 0, list: [] },
    [UserListType.Replies]: { total: 0, list: [] },
    [UserListType.Notifications]: { total: 0, list: [] },
    [UserListType.Followers]: { total: 0, list: [] },
    [UserListType.Following]: { total: 0, list: [] },
  })
  const { query } = useRouter()
  const tokenAddr = (query.address || '') as string

  const {
    data = { list: [], total: 0 },
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [userApi.list.name, tokenAddr, type],
    queryFn: ({ pageParam }) => {
      if (isEmpty(tokenAddr)) return Promise.reject()
      return userApi.list(tokenAddr, {
        type,
        page: pageParam,
        page_size: 25,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      list: data.pages.flatMap((p) => p.data.results),
      total: data.pages[0].data.count,
    }),
  })

  // Set list mapping.
  useEffect(() => {
    if (isEmpty(data?.list)) return
    setListMap((prev) => ({
      ...prev,
      [type]: {
        total: data.total,
        list: data.list,
      },
    }))
  }, [data])

  return {
    listMap,
    tokenHeld: listMap[UserListType.CoinsHeld],
    tokenCreated: listMap[UserListType.CoinsCreated],
    comments: listMap[UserListType.Replies],
    mentions: listMap[UserListType.Notifications],
    followers: listMap[UserListType.Followers],
    following: listMap[UserListType.Following],
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
  }
}
