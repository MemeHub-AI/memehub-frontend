import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { getDistributorConfig } from '@/contract/v2/config/distributor'
import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/contract'

export const useAirdropInfo = (chainName?: string, distributionId = 0) => {
  const { address } = useAccount()
  const { chainId } = useChainInfo(chainName)
  const config = getDistributorConfig(chainId)

  console.log('id', distributionId, !!distributionId)
  const { data: amountLeftWei = BI_ZERO } = useReadContract({
    ...config!,
    functionName: 'getAmountLeft',
    chainId,
    args: [BigInt(distributionId)],
    query: { enabled: !!distributionId && !!config },
  })

  const { data: amountClaimedWei = BI_ZERO } = useReadContract({
    ...config!,
    functionName: 'getAmountClaimed',
    chainId,
    args: [BigInt(distributionId)],
    query: { enabled: !!distributionId && !!config },
  })
  const amountLeft = formatEther(amountLeftWei)
  const amountClaimed = formatEther(amountClaimedWei)

  const { data: isClaimed } = useReadContract({
    ...config!,
    functionName: 'isClaimed',
    chainId,
    args: [BigInt(distributionId), address!],
    query: { enabled: !!distributionId && !!address },
  })

  return {
    amountLeft,
    amountClaimed,
    isClaimed,
  }
}
