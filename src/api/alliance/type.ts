export interface Query {
  /**
   * 页码
   */
  page: number
  /**
   * 每页数量
   */
  page_size?: number
  [property: string]: any
}

export interface KolListItem {
  /**
   * kol大使描述
   */
  description: string
  /**
   * kol大使id，ID 编号
   */
  id: string
  /**
   * kol大使logo
   */
  logo: string
  /**
   * kol大使名称
   */
  name: string
  /**
   * kol大使电报群url
   */
  telegram_group_url: string
  /**
   * kol大使电报url
   */
  telegram_url: string
  /**
   * kol大使推特url
   */
  twitter_url: string
  [property: string]: any
}

export interface CommunityListItem {
  /**
   * kol大使描述
   */
  description: string
  /**
   * kol大使id，ID 编号
   */
  id: string
  /**
   * kol大使logo
   */
  logo: string
  /**
   * kol大使名称
   */
  name: string
}

export interface AirdropItem {
  name: string
  ticker: string
  logo: string
  amount: number
  create: number
  address: string
  community_name: string
  community_logo: string
  kol_name: string
  kol_logo: string
  chain: string
}

export interface IdentityList {
  kol?: Kol
  community?: Kol[]
}

export interface Kol {
  id: number
  name: string
  logo: string
  description: string
}
