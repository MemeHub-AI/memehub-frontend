import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/v3/abi/kol-nft'
import { v3Addr } from '@/contract/v3/address'
import { useIdoContext } from '@/contexts/ido'
import { useCommunityNft } from '@/hooks/use-community-nft'

export const useIdoCheck = () => {
  const { address } = useAccount()
  const { chainId } = useIdoContext()
  const { kolNft } = v3Addr[chainId] ?? {}

  const { data: kolTokenId = BI_ZERO } = useReadContract({
    abi: kolNftAbi,
    address: kolNft,
    chainId,
    functionName: 'userOfId',
    args: [address!],
    query: { enabled: !!address },
  })
  const isKol = !BigNumber(kolTokenId.toString()).isZero()

  const { community } = useCommunityNft(chainId, !isKol)

  return {
    kolTokenId,
    isKol,
    community,
  }
}
