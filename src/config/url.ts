import { dotenv } from '@/utils/env'

const prod = {
  memehub: 'https://api.memehub.ai',
  ws: 'wss://api.memehub.ai',
}

const dev = {
  memehub: 'https://dev.memehub.ai',
  ws: 'wss://dev.memehub.ai',
}

export const apiUrl = dotenv.isDev ? dev : prod
