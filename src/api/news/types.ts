export interface NewsData {
  title: Title
  image: Image
  articles: Article[]
}

export interface Article {
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
  name: string
  short_name: string
}
