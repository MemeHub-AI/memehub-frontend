import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import type { TokenListReq, TokenListRes } from './types'

export const tokenApi = {
  list(req: TokenListReq) {
    return api.GET<TokenListRes>('/api/v1/coin/coinslist/' + qs.stringify(req))
  },
}
