import { useMutation } from '@tanstack/react-query'

import type { TokenUpdateReq } from '@/api/token/types'
import { tokenApi } from '@/api/token'

export const useCreateToken = () => {
  // Submit created token to backend.
  const {
    data: createData,
    error: createTokenError,
    isPending: isCreatingToken,
    mutateAsync: createToken,
  } = useMutation({
    mutationKey: [tokenApi.create.name],
    mutationFn: tokenApi.create,
  })
  const createTokenData = createData?.data

  // Update already created token. used for create error or interrupted.
  const {
    data: updateData,
    error: updateTokenError,
    isPending: isUpdatingToken,
    mutateAsync: updateToken,
  } = useMutation({
    mutationKey: [tokenApi.update.name],
    mutationFn: (params: TokenUpdateReq & { addr: string }) => {
      const { addr, ...req } = params
      return tokenApi.update(addr, req)
    },
  })
  const updateTokenData = updateData?.data

  return {
    createTokenData,
    updateTokenData,
    createTokenError,
    updateTokenError,
    isCreatingToken,
    isUpdatingToken,
    createToken,
    updateToken,
  }
}
