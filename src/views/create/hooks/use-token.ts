import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type { TokenNewReq, TokenUpdateReq } from '@/api/token/types'

import { tokenApi } from '@/api/token'

export const useToken = () => {
  const [id, setId] = useState(-1)

  const { mutateAsync } = useMutation({
    mutationKey: [tokenApi.new.name],
    mutationFn: tokenApi.new,
  })

  const { mutateAsync: updateToken } = useMutation({
    mutationKey: [tokenApi.update.name],
    mutationFn: (req: TokenUpdateReq) => {
      if (id === -1) {
        return Promise.reject('id is not set')
      }
      return tokenApi.update(id, req)
    },
  })

  const create = async (params: TokenNewReq) => {
    const { data } = await mutateAsync(params)

    setId(data.coin_id)
  }

  return {
    create,
    update: updateToken,
  }
}
