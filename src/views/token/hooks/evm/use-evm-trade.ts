import { useRef } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useInvite } from '@/hooks/use-invite'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useTradeAmount } from '../use-trade-amount'

export const useEvmTrade = (onSuccess?: () => void) => {
  const {
    tokenInfo: { bond_version, bond_address } = {},
    tokenAddr,
    chainId,
    isGraduated,
    refetchTokenInfo,
  } = useTokenContext()
  const { address } = useAccount()
  const { getReferrals } = useInvite()
  const { getTokenAmount, getReserveAmount, getLastAmount } = useTradeAmount()
  const isLastBuy = useRef(false)
  const bcConfig = {
    abi: bcAbiMap[bond_version!],
    address: bond_address as Address,
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
    onFinally: () => {
      resetTrade()
      if (isLastBuy.current) refetchTokenInfo()
    },
  })

  const checkForWrite = async (amount: string) => {
    if (BigNumber(amount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return false
    }
    return true
  }

  const checkForLastBuy = async (amount: string) => {
    if (isGraduated || isLastBuy.current) return
    const [, amountLeft] = await getLastAmount()
    isLastBuy.current = BigNumber(amountLeft).minus(amount).lte(0)
  }

  const buy = async (reserveAmount: string, slippage: string) => {
    const [, tokenAmount] = await getTokenAmount(reserveAmount)
    if (!(await checkForWrite(tokenAmount))) return

    const reserveValue = parseEther(reserveAmount)

    checkForLastBuy(reserveAmount)
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
    if (!(await checkForWrite(reserveAmount))) return

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
