export interface AIMemeInfo {
  name: string
  description: string
  image?: string
}

export interface AIMemeInfoQuery {
  input: string
}

export interface AIMemeImageQuery extends AIMemeInfo {}
