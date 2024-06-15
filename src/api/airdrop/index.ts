import { ApiResponse } from '../types'
import { AirdropMerkleRootReq, AirdropMerkleRootRes } from './types'

import { api } from '..'
import { qs } from '@/hooks/use-fetch'

export const airdropApi = {
  list: () => {
    return api.GET('/api/v1/airdrop/airdrop_list/')
  },
  getMerkleRoot: (req: AirdropMerkleRootReq) => {
    return api.GET<ApiResponse<AirdropMerkleRootRes>>(
      '/api/v1/airdrop/generate_root/' + qs.stringify(req)
    )
  },
}
