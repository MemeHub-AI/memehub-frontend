import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { BI_ZERO } from '@/constants/number'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { v3Addr } from '@/contract/v3/address'
import { v3RecommendAbi } from '@/contract/v3/abi/recommend'

export const useReward = (chainId: number) => {
  const { t } = useTranslation()
  const { address, chainId: accountChainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { recommend } = v3Addr[chainId] ?? {}

  const { data: total = BI_ZERO, refetch: refetchAmount } = useReadContract({
    abi: v3RecommendAbi,
    address: recommend,
    functionName: 'obtainedAmount',
    chainId,
    args: [address!],
    query: { enabled: !!recommend && !!address },
  })
  const { data: claimed = BI_ZERO, refetch: refetchClaimed } = useReadContract({
    abi: v3RecommendAbi,
    address: recommend,
    chainId,
    functionName: 'alreadyClaimed',
    args: [address!],
    query: { enabled: !!recommend && !!address },
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

  const claimReward = async () => {
    if (!recommend) {
      CONTRACT_ERR.configNotFound()
      return
    }
    if (accountChainId !== chainId) {
      await switchChainAsync({ chainId }).catch(() => {})
      return
    }

    writeContract({
      abi: v3RecommendAbi,
      address: recommend,
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
