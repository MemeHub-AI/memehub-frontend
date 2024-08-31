import { dotenv } from '@/utils/env'

const prod = {
  memehub: '',
  idea: '',
}

const dev = {
  memehub: '3Xdz2R4EZtmu76cSL2TdE8vgJKShsKYJSWTpLkzAV6XF',
  idea: '',
}

export const programId = dotenv.isDev ? dev : prod
