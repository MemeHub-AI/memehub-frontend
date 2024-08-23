import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Address, formatEther } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { memexFactoryAbiMap } from '@/contract/abi/memex/factory'
import { useTokenConfig } from '@/hooks/use-token-config'
import { BI_ZERO } from '@/constants/number'
import { memexIdoAbiMap, MemexIdoVersion } from '@/contract/abi/memex/ido'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useChainInfo } from '@/hooks/use-chain-info'
import { CONTRACT_ERR } from '@/errors/contract'

export const useIdeaInitialBuy = (
  chain: string | undefined,
  idoAddr?: string,
  idoVersion?: MemexIdoVersion
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { memexFactoryAddr, memexFactoryVersion } = useTokenConfig(chain)
  const { chainId } = useChainInfo(chain)
  const idoConfig = {
    abi: memexIdoAbiMap[idoVersion!],
    address: idoAddr as Address,
    chainId,
  }
  const idoQuery = { enabled: !!idoAddr && !!idoVersion }

  const { data: maxBuy = BI_ZERO, refetch: refetchInitialMax } =
    useReadContract({
      abi: memexFactoryAbiMap[memexFactoryVersion!],
      address: memexFactoryAddr!,
      chainId,
      functionName: 'maxBuy',
      query: { enabled: !!memexFactoryAddr && !!memexFactoryVersion },
    })
  const initialBuyMax = formatEther(maxBuy)

  const { data: canRefundInitial = false, refetch: refetchCanRefund } =
    useReadContract({
      ...idoConfig,
      functionName: 'isHasInitWithdraw',
      query: idoQuery,
    })
  const { data: isRefundedInitial = false, refetch: refetchIsRefunded } =
    useReadContract({
      ...idoConfig,
      functionName: 'isInitWithdrawETH',
      args: [address!],
      query: { enabled: idoQuery.enabled && !!address },
    })
  const { data: initAmountIn = BI_ZERO, refetch: refetchInitialAmount } =
    useReadContract({
      ...idoConfig,
      functionName: 'initAmountIn',
      query: idoQuery,
    })
  const initialBuyAmount = formatEther(initAmountIn)

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('refunding')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('refunding')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => toast.success(t('refund-success')),
    onFinally: () => {
      reset()
      refetchInitalBuy()
      toast.dismiss()
    },
  })

  const refundInitialBuy = () => {
    if (!idoQuery.enabled) {
      CONTRACT_ERR.configNotFound()
      return
    }

    writeContract({
      ...idoConfig,
      functionName: 'withdrawInitETH',
    })
  }

  const refetchInitalBuy = () => {
    refetchInitialMax()
    refetchCanRefund()
    refetchIsRefunded()
    refetchInitialAmount()
  }

  return {
    initialBuyMax,
    initialBuyAmount,
    canRefundInitial,
    isRefundedInitial,
    isRefundingInitial: isPending || isLoading,
    refetchInitalBuy,
    refundInitialBuy,
  }
}
