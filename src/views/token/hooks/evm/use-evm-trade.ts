import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useInvite } from '@/hooks/use-invite'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useTradeAmount } from '../use-trade-amount'

export const useEvmTrade = (onSuccess?: () => void) => {
  const { tokenAddr, chainId, bcVersion, bcAddr } = useTokenContext()
  const { address } = useAccount()
  const { getReferrals } = useInvite()
  const { getTokenAmount, getReserveAmount } = useTradeAmount()
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

  const buy = async (reserveAmount: string, slippage: string) => {
    const [, tokenAmount] = await getTokenAmount(reserveAmount)
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }
    const reserveValue = parseEther(reserveAmount)

    writeContract({
      ...bcConfig,
      functionName: 'mint',
      args: [
        tokenAddr,
        reserveValue,
        subSlippage(tokenAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
      value: reserveValue,
    })
  }

  const sell = async (tokenAmount: string, slippage: string) => {
    const [, reserveAmount] = await getReserveAmount(tokenAmount)
    if (BigNumber(reserveAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    writeContract({
      ...bcConfig,
      functionName: 'burn',
      args: [
        tokenAddr,
        parseEther(tokenAmount),
        subSlippage(reserveAmount, slippage),
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
  }
}