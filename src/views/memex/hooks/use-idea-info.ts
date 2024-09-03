import { Address, zeroAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

import {
  memexIdoAbiMap,
  memexIdoLatest,
  MemexIdoVersion,
} from '@/contract/abi/memex/ido'

export const useIdeaInfo = (
  chainId: number,
  version: MemexIdoVersion | undefined,
  contract: string | undefined
) => {
  const { address } = useAccount()
  const idoConfig = {
    abi: memexIdoAbiMap[version!] as typeof memexIdoLatest,
    address: contract as Address,
    chainId,
  }

  const {
    data: ideaInfo,
    isLoading: isLoadingInfo,
    refetch: refetchInfo,
  } = useReadContract({
    ...idoConfig,
    functionName: 'getProjectInfo',
    args: [address || zeroAddress],
    query: {
      enabled: !!contract && !!chainId,
      refetchInterval: 5_000,
    },
  })

  return {
    ideaInfo,
    isLoadingInfo,
    refetchInfo,
  }
}
