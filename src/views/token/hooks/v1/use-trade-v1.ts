import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useInvite } from '../use-invite'
import { BcAbiVersion, bondingCurveAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenContext } from '@/contexts/token'
import { useTradeAmount } from './use-trade-amount'

export const useTradeV1 = () => {
  const { address } = useAccount()
  const { getReferrals } = useInvite()
  const { tokenAddr, chainId, bcVersion, bcAddr } = useTokenContext()
  const bcAbi = bondingCurveAbiMap[bcVersion as BcAbiVersion.V0_1_0]
  const { getReserveAmount, getTokenAmount } = useTradeAmount()
  const bcConfig = {
    abi: bcAbi,
    address: bcAddr!,
    chainId,
  }

  const {
    data: hashV1,
    isPending: isSubmittingV1,
    writeContract,
    reset: resetTradeV1,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        resetTradeV1()
      },
    },
  })

  const buyV1 = async (amount: string, slippage: string) => {
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

  const sellV1 = async (amount: string, slippage: string) => {
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
    hashV1,
    isSubmittingV1,
    buyV1,
    sellV1,
    resetTradeV1,
    getReserveAmountV1: getReserveAmount,
    getTokenAmountV1: getTokenAmount,
  }
}
