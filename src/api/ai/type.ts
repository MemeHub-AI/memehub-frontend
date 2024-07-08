export interface AIMemeInfo {
  name?: string
  description?: string
  symbol?: string
  image?: string
  chainName?: string
  background?: string
}

export interface AIMemeInfoQuery {
  input: string
  type?: 1 | 0
  background?: string
}

export interface AIMemeImageQuery extends AIMemeInfo {}

export interface AIMemePosterQuery extends AIMemeInfo {
  name?: string
  description?: string
}

export interface AIEMemePosterData {
  poster1: string[]
  poster2: string[]
}
