export interface RewardItem {
  category: number
  chain: string
  earned: string
  time: string
  username: string
}

export interface RewardDetailRes {
  code: string
  description: null
  id: number
  inviter: InviterLevel<string>
  inviter_count: InviterLevel<number>
  like_count: number
  logo: string
  mention_count: number
  name: string
  reward_amount: number
  wallet_address: string
}

interface InviterLevel<T> {
  one: T
  two: T
}
