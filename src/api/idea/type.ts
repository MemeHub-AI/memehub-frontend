export interface IdeaQuery {
  page?: number
  pageSize?: number
}

export interface IdeaData {
  id: number
  title: string
  description: string
  paltform: IdeaPaltform[]
}

export interface IdeaPaltform {
  logo: string
  name: string
}

export interface IdeaRes {
  list: IdeaData[]
  total: number
}
