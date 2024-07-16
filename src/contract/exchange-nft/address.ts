import { bsc, base, blast } from 'wagmi/chains'

import { dotenv } from '@/utils/env'

const prod = {
  [bsc.id]: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
  [base.id]: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
  [blast.id]: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
} as const

const dev = {
  [bsc.id]: '0x5f5EAC903c8CCf445671580C178a7B6815519a12',
  [base.id]: '0xBe6544fb6041Fc0638D1E03A8ff41Fc718596758',
  [blast.id]: '0xdBcf1F26CA92F61ba0C466a68F06460158339b05',
}

export const exchangeAddr = dotenv.isDev ? dev : prod
