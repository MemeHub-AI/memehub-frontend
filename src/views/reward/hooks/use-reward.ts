import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { getV3Config } from '@/contract/v3/config'
import { BI_ZERO } from '@/constants/contract'
import { useChainsStore } from '@/stores/use-chains-store'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'

export const useReward = (chainId: number) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { recommendConfig } = getV3Config(chainId)
  const { findChain } = useChainsStore()

  console.log('c', findChain(chainId))

  const { data: total = BI_ZERO } = useReadContract({
    ...recommendConfig!,
    functionName: 'obtainedAmount',
    args: [address!],
    query: { enabled: !!recommendConfig && !!address },
  })
  const { data: claimed = BI_ZERO } = useReadContract({
    ...recommendConfig!,
    functionName: 'alreadyClaimed',
    args: [address!],
    query: { enabled: !!recommendConfig && !!address },
  })
  const totalAmount = formatEther(total)
  const claimedAmount = formatEther(claimed)
  const unclaimedAmount = BigNumber(totalAmount).minus(claimedAmount).toFixed()

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: { onError: (e) => CONTRACT_ERR.exec(e) },
  })
  const { isFetching } = useWaitForTx({
    hash,
    onSuccess: () => toast.success(t('claim.success')),
    onError: () => CONTRACT_ERR.claimFailed(),
    onFillay: () => reset(),
  })
  const isClaiming = isPending || isFetching

  const claimReward = () => {
    if (!recommendConfig) {
      CONTRACT_ERR.configNotFound()
      return
    }

    writeContract({
      ...recommendConfig!,
      functionName: 'claimTokens',
      chainId,
    })
  }

  return {
    totalAmount,
    claimedAmount,
    unclaimedAmount,
    isClaiming,
    claimReward,
  }
}
