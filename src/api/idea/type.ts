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
}

export interface IdeaRes {
  list: IdeaDataList[]
  total: number
}

export interface IdeaBasicInfo {
  id: number
  title: string
  content: string
  logo: string
}
