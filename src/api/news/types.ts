export interface NewsQuery {
  country?: number
  page?: number
  page_size?: number
}

export interface NewsData {
  id: number
  title: Title
  image: Image
  articles: Article[]
}

export interface Article {
  id: number
  title: string
  timeAgo: string
  source: string
  image: Image
  timestamp: number
  url: string
  snippet: string
}

export interface Image {
  newsUrl: string
  source: string
  imageUrl: string
}

export interface Title {
  query: string
  exploreLink: string
}

export interface CountryData {
  id: number
  name: {
    en: string
    zh: string
  }
  short_name: string
}

export interface OpportunityData {
  id: number
  title: string
  content: string
  image: string
  rank: number
  created_at: string
  updated_at: string
}

export interface MemeInfoDialogData {
  id: number
  title: string
  content: string
  description: string
  image: string
  link: string
  logo: string
}
