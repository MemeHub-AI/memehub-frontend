import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useInvite } from '../use-invite'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'
import { useTradeAmount } from './use-trade-amount'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'

export const useEvmTrade = (onSuccess?: () => void) => {
  const { address } = useAccount()
  const { getReferrals } = useInvite()
  const { tokenAddr, chainId, bcVersion, bcAddr } = useTokenContext()
  const { getReserveAmount, getTokenAmount } = useTradeAmount()
  const bcConfig = {
    abi: bcAbiMap[bcVersion!],
    address: bcAddr!,
    chainId,
  }

  const {
    data: hash,
    isPending: isSubmitting,
    writeContract,
    reset: resetTrade,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        resetTrade()
      },
    },
  })

  // This `useWaitForTx` only track status.
  const { isFetched: isTraded } = useWaitForTx({
    hash,
    onSuccess,
    onFinally: () => resetTrade(),
  })

  const buy = async (amount: string, slippage: string) => {
    const reserveAmount = parseEther(amount)
    const tokenAmount = formatEther(await getTokenAmount(amount))
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    writeContract({
      ...bcConfig,
      functionName: 'mint',
      args: [
        tokenAddr,
        reserveAmount,
        subSlippage(tokenAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
      value: reserveAmount,
    })
  }

  const sell = async (amount: string, slippage: string) => {
    const nativeAmount = formatEther(await getReserveAmount(amount))
    if (BigNumber(nativeAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    writeContract({
      ...bcConfig,
      functionName: 'burn',
      args: [
        tokenAddr,
        parseEther(amount),
        subSlippage(nativeAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
    })
  }

  return {
    hash,
    isSubmitting,
    isTraded,
    buy,
    sell,
    resetTrade,
    getReserveAmount,
    getTokenAmount,
  }
}
