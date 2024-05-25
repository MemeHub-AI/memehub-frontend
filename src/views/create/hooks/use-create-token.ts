import { useMutation } from '@tanstack/react-query'

import type { TokenUpdateReq } from '@/api/token/types'

import { tokenApi } from '@/api/token'

export const useCreateToken = () => {
  // Submit created token to backend.
  const { mutateAsync: create } = useMutation({
    mutationKey: [tokenApi.create.name],
    mutationFn: tokenApi.create,
  })

  // Update already created token. used for create error or interrupted.
  const { mutateAsync: update } = useMutation({
    mutationKey: [tokenApi.update.name],
    mutationFn: (params: TokenUpdateReq & { id: string }) => {
      const { id, ...req } = params
      return tokenApi.update(id, req)
    },
  })

  return {
    create,
    update,
  }
}
