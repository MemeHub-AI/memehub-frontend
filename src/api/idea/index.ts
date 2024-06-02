import { utilTime } from '@/utils/time'
import type { ApiResponse, Pagination } from '../types'
import { IdeaQuery, IdeaData } from './type'
import { api } from '..'
import { qs } from '@/hooks/use-fetch'

export const ideaApi = {
  async getIdea(query?: IdeaQuery) {
    // return api.GET<ApiResponse<Pagination<IdeaData>>>(
    //   '/api/v1/idea/' + qs.stringify(query)
    // )
    await utilTime.wait(2500)
    return {
      data: {
        count: 9,
        results: [
          {
            id: 1,
            title: 'Ivanka Trump',
            description: '特朗普的女儿伊万卡，人长得漂亮，有很高知名度',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
                name: 'IVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
            ],
          },
          {
            id: 2,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
                name: 'IVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
          {
            id: 3,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',
            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
          {
            id: 4,
            title: 'Ivanka Trump',
            description: '特朗普的女儿伊万卡，人长得漂亮，有很高知名度',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
                name: 'IVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
            ],
          },
          {
            id: 5,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
          {
            id: 6,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
          {
            id: 7,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
          {
            id: 8,
            title: 'Ivanka Trump',
            description: '特朗普的女儿伊万卡，人长得漂亮，有很高知名度',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
                name: 'IVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
            ],
          },
          {
            id: 9,
            title: 'Tiffany Trump',
            description: '特朗普的小女儿，美国职业模特和歌手特朗普和前妻所生',

            paltform: [
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'IVANKA Trump',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
              {
                logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/5bb9393d4429716476cf33f10c030c4bc.avif',
                name: 'BABY INVANKA',
              },
            ],
          },
        ] as unknown as IdeaData[],
      },
    }
  },
}
