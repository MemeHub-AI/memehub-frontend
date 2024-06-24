import { useRouter } from 'next/router'
import { Address } from 'viem'

export const useTradeSearchParams = () => {
  const { query } = useRouter()

  const chainName = (query.chain ?? '') as Address
  const tokenAddr = (query.address ?? '') as Address
  const referralCode = (query.r ?? '') as string

  return {
    chainName,
    tokenAddr,
    referralCode,
  }
}
