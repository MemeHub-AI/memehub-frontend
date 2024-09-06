import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { userApi } from '@/api/user'
import { UserListRes, UserListType } from '@/api/user/types'
import { tokenApi } from '@/api/token'

type ListMap = {
  [K in UserListType]: {
    total: number
    list: UserListRes[K][]
  }
}

const empty = { list: [], total: 0 }

export const useUserList = (type: UserListType, isOtherUser = true) => {
  // Why we need a map?
  // An error will occured when `AccountTab` change if use uniform `list`.
  // Because the new tab uses the old list data, it will cause data format errors.
  const [listMap, setListMap] = useState<ListMap>({
    [UserListType.CoinsHeld]: { total: 0, list: [] },
    [UserListType.CoinsCreated]: { total: 0, list: [] },
    [UserListType.Comments]: { total: 0, list: [] },
    [UserListType.Mentions]: { total: 0, list: [] },
    [UserListType.Followers]: { total: 0, list: [] },
    [UserListType.Following]: { total: 0, list: [] },
  })
  const { query } = useRouter()
  const userAddr = (query.address || '') as string

  const [isHeld, isCreated, isComments, isMentions] = useMemo(
    () => [
      type === UserListType.CoinsHeld,
      type === UserListType.CoinsCreated,
      type === UserListType.Comments,
      type === UserListType.Mentions,
    ],
    [type]
  )

  const {
    data = empty,
    isLoading,
    isFetching,
    isFetched,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [userApi.list.name, userAddr, type],
    queryFn: ({ pageParam }) => {
      if (isEmpty(userAddr)) return Promise.reject()
      return userApi.list(userAddr, {
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
  const {
    data: { myTokenList = [], myTokenTotal = 0 } = {},
    isLoading: isLoadingMyTokens,
    isFetching: isFetchingMyTokens,
    fetchNextPage: fetchNextMyTokens,
    refetch: refetchMyTokens,
  } = useInfiniteQuery({
    queryKey: [tokenApi.getListByUser.name, userAddr, type],
    queryFn: ({ pageParam }) => {
      return tokenApi.getListByUser({
        address: userAddr,
        page: pageParam,
        page_size: 25,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      myTokenList: data.pages.flatMap((p) => p.data.results || []),
      myTokenTotal: data.pages[0].data.count,
    }),
    enabled: isCreated,
  })
  const myTokens = useMemo(() => {
    return isOtherUser ? myTokenList.filter((t) => t.is_active) : myTokenList
  }, [myTokenList])

  // Set list mapping.
  useEffect(() => {
    // if (isEmpty(data?.list)) return
    if (!isFetched) return
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
    comments: listMap[UserListType.Comments],
    mentions: listMap[UserListType.Mentions],
    followers: listMap[UserListType.Followers],
    following: listMap[UserListType.Following],
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,

    myTokens,
    myTokenTotal,
    isLoadingMyTokens,
    isFetchingMyTokens,
    fetchNextMyTokens,
    refetchMyTokens,
  }
}
