export interface IdeaQuery {
  page?: number
  pageSize?: number
}

export interface IdeaDataList {
  id: number
  name: string
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
  description: string
  logo: string
}
