import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/contract'
import { getV3Config } from '@/contract/v3/config'

export const useAirdropInfo = (chainName?: string, id = 0) => {
  const { address } = useAccount()
  const { chainId } = useChainInfo(chainName)
  const { distributorConfig } = getV3Config(chainId)

  const { data: amountLeftWei = BI_ZERO } = useReadContract({
    ...distributorConfig!,
    functionName: 'getAmountLeft',
    chainId,
    args: [BigInt(id)],
    query: { enabled: !!distributorConfig },
  })

  const { data: amountClaimedWei = BI_ZERO } = useReadContract({
    ...distributorConfig!,
    functionName: 'getAmountClaimed',
    chainId,
    args: [BigInt(id)],
    query: { enabled: !!distributorConfig },
  })
  const left = formatEther(amountLeftWei)
  const claimed = formatEther(amountClaimedWei)
  const total = BigNumber(left).plus(claimed)

  const { data: isKolClaimed } = useReadContract({
    ...distributorConfig!,
    functionName: 'isClaimedKOL',
    args: [BigInt(id), address!],
    chainId,
    query: { enabled: !!address },
  })

  const { data: isCommunityClaimed } = useReadContract({
    ...distributorConfig!,
    functionName: 'isClaimedCommunity',
    args: [BigInt(id), address!],
    chainId,
    query: { enabled: !!address },
  })

  return {
    total,
    left,
    claimed,
    isKolClaimed,
    isCommunityClaimed,
  }
}
