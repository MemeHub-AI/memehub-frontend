import { useMutation } from '@tanstack/react-query'

import type { TokenUpdateReq } from '@/api/token/types'

import { tokenApi } from '@/api/token'
import { airdropApi } from '@/api/airdrop'

export const useCreateToken = () => {
  // Submit created token to backend.
  const {
    data: createData,
    error: createTokenError,
    isPending: isCreatingToken,
    mutateAsync: create,
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
    mutateAsync: update,
  } = useMutation({
    mutationKey: [tokenApi.update.name],
    mutationFn: (params: TokenUpdateReq & { addr: string }) => {
      const { addr, ...req } = params
      return tokenApi.update(addr, req)
    },
  })
  const updateTokenData = updateData?.data

  const {
    data: merkleRootData,
    error: merkleRootError,
    isPending: isGettingMerkleRoot,
    mutateAsync: getMerkleRoot,
  } = useMutation({
    mutationKey: [airdropApi.getMerkleRoot.name],
    mutationFn: airdropApi.getMerkleRoot,
  })

  return {
    createTokenData,
    updateTokenData,
    merkleRootData,
    createTokenError,
    updateTokenError,
    merkleRootError,
    isCreatingToken,
    isUpdatingToken,
    isGettingMerkleRoot,
    create,
    update,
    getMerkleRoot,
  }
}
