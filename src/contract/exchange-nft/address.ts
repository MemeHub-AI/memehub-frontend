import { bsc, base, blast } from 'wagmi/chains'

export const exchangeAddr = {
  [bsc.id]: '0x5f5EAC903c8CCf445671580C178a7B6815519a12',
  [base.id]: '0xBe6544fb6041Fc0638D1E03A8ff41Fc718596758',
  [blast.id]: '0xdBcf1F26CA92F61ba0C466a68F06460158339b05',
} as const
