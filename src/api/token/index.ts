import { ApiResponse, api } from '..'
import { qs } from '@/hooks/use-fetch'

import type {
  TokenListReq,
  TokenListRes,
  TokenNewReq,
  TokenNewRes,
  TokenUpdateReq,
} from './types'

export const tokenApi = {
  list(req: TokenListReq) {
    return api.GET<TokenListRes>('/api/v1/coin/coinslist/' + qs.stringify(req))
  },
  new(req: TokenNewReq) {
    return api.POST<ApiResponse<TokenNewRes>>('/api/v1/coin/coins/', {
      body: req,
    })
  },
  update(id: string | number, req: TokenUpdateReq) {
    return api.PATCH<null>(`/api/v1/coin/coins/${id}/`, { body: req })
  },
}
