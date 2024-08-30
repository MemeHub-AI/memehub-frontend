import { utilTime } from '@/utils/day'
import { api } from '..'
import { ApiResponse } from '../types'
import { ChainData } from './type'

export const chainApi = {
  async getChain() {
    return api.GET<ApiResponse<ChainData[]>>('/api/v1/chain/')
  },

  async getChainLaunchedToken() {
    await utilTime.wait(1500)
    return [
      {
        logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
        cream: 2,
      },
      {
        logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
        cream: 1,
      },
      {
        logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
        cream: 3,
      },
      {
        logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
        cream: 4,
      },
    ]
    // return api.GET<ApiResponse<ChainData[]>>('/api/v1/chain/launched-token')
  },
}
