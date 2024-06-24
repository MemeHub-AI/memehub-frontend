import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/contract'
import { getV3Config } from '@/contract/v3/config'

export const useAirdropInfo = (chainName?: string, distributionId = 0) => {
  const { chainId } = useChainInfo(chainName)
  const { distributorConfig } = getV3Config(chainId)

  const { data: amountLeftWei = BI_ZERO } = useReadContract({
    ...distributorConfig!,
    functionName: 'getAmountLeft',
    chainId,
    args: [BigInt(distributionId)],
    query: { enabled: !!distributionId && !!distributorConfig },
  })

  const { data: amountClaimedWei = BI_ZERO } = useReadContract({
    ...distributorConfig!,
    functionName: 'getAmountClaimed',
    chainId,
    args: [BigInt(distributionId)],
    query: { enabled: !!distributionId && !!distributorConfig },
  })
  const amountLeft = formatEther(amountLeftWei)
  const amountClaimed = formatEther(amountClaimedWei)

  console.log('airdrop', amountLeft, amountClaimed)

  const { data: isClaimed } = useReadContract({
    ...distributorConfig!,
    functionName: 'distributions',
    chainId,
    args: [BigInt(distributionId)],
    query: { enabled: !!distributionId },
  })

  return {
    amountLeft,
    amountClaimed,
    isClaimed,
  }
}
