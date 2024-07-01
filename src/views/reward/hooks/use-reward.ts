import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { getV3Config } from '@/contract/v3/config'
import { BI_ZERO } from '@/constants/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'

export const useReward = (chainId: number) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { recommendConfig } = getV3Config(chainId)

  const { data: total = BI_ZERO, refetch: refetchAmount } = useReadContract({
    ...recommendConfig!,
    functionName: 'obtainedAmount',
    args: [address!],
    query: { enabled: !!recommendConfig && !!address },
  })
  const { data: claimed = BI_ZERO, refetch: refetchClaimed } = useReadContract({
    ...recommendConfig!,
    functionName: 'alreadyClaimed',
    args: [address!],
    query: { enabled: !!recommendConfig && !!address },
  })
  const totalAmount = formatEther(total)
  const claimedAmount = formatEther(claimed)
  const unclaimedAmount = BigNumber(totalAmount).minus(claimedAmount).toFixed()
  const isClaimed =
    BigNumber(totalAmount).isZero() || BigNumber(unclaimedAmount).isZero()

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
    onLoading: () => toast.loading(t('claiming')),
    onSuccess: () => toast.success(t('claim.success')),
    onError: () => CONTRACT_ERR.claimFailed(),
    onFillay: () => {
      toast.dismiss()
      reset()
      refetchAmount()
      refetchClaimed()
    },
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
    isClaimed,
    claimReward,
  }
}
