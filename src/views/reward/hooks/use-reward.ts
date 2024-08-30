import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { BI_ZERO } from '@/constants/number'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTokenConfig } from '@/hooks/use-token-config'
import { recommendAbiMap } from '@/contract/abi/recommend'
import { useCheckAccount } from '@/hooks/use-check-chain'

// TODO/top: aggregate multi
export const useReward = (chainName: string, chainId: number) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { checkForChain } = useCheckAccount()
  const { recommendAddress, recommendVersion } = useTokenConfig(chainName)
  const config = {
    abi: recommendAbiMap[recommendVersion!],
    address: recommendAddress!,
    chainId,
  }
  const query = {
    enabled: !!config.address && !!config.chainId,
  }

  const { data: total = BI_ZERO, refetch: refetchAmount } = useReadContract({
    ...config,
    functionName: 'obtainedAmount',
    args: [address!],
    query,
  })
  const { data: claimed = BI_ZERO, refetch: refetchClaimed } = useReadContract({
    ...config,
    functionName: 'alreadyClaimed',
    args: [address!],
    query,
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
    mutation: { onError: ({ message }) => CONTRACT_ERR.message(message) },
  })
  const { isFetching } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('claiming')),
    onSuccess: () => toast.success(t('claim.success')),
    onError: () => CONTRACT_ERR.claimFailed(),
    onFinally: () => {
      toast.dismiss()
      reset()
      refetchAmount()
      refetchClaimed()
    },
  })
  const isClaiming = isPending || isFetching

  const claimReward = async () => {
    if (!(await checkForChain(chainId))) return
    if (!config.address) {
      CONTRACT_ERR.configNotFound()
      return
    }

    // TODO: should simulate first.
    writeContract({
      ...config,
      functionName: 'claimTokens',
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
