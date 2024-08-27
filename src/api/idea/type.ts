import { Chain } from '../user/types'

export interface IdeaQuery {
  type: string
  page?: number
  pageSize?: number
}

export interface IdeaDataList {
  id: number
  name: string
  symbol: string
  logo: string
  description: string
  tokens: IdeaTokens[]
}

export interface IdeaTokens {
  id: string
  name: string
  symbol: string
  image_url: string
  contract_address: string
  chain: string
  coin_type: number
}

export interface IdeaRes {
  list: IdeaDataList[]
  total: number
}

export interface IdeaBasicInfo {
  id: number
  title: string
  description: string
  content: string
  logo: string
  meme: any
  category: string
}

export interface MemeStoryData {
  id: number
  title: string
  content: string
  logo: string
  types: any
}
