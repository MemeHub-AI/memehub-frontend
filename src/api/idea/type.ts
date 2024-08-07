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
  id: number
  name: string
  ticker: string
  logo: string
  address: string
  chain: Chain
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
