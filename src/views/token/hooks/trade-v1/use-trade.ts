import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther } from 'viem'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { useInvite } from '../use-invite'
import { v3Addr } from '@/contract/address'
import { v3BondingCurveAbi } from '@/contract/abi/v1/bonding-curve'

export const useTradeV3 = () => {
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { getReferrals } = useInvite()
  const { bondingCurve } = v3Addr[chainId] ?? {}

  const {
    getReserveAmount,
    getTokenAmount,
    checkForOverflow,
    getLastOrderAmount,
  } = useTradeInfoV3()
  const {
    data: hashV3,
    isPending: isSubmittingV3,
    writeContract,
    reset: resetTradeV3,
  } = useWriteContract({
    mutation: {
      onError: (e) => {
        CONTRACT_ERR.message(e)
        resetTradeV3()
      },
    },
  })

  const checkForTrade = (amount: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    if (!isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }

    return true
  }

  const buyV3 = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const reserveAmount = parseEther(amount)
    const tokenAmount = formatEther(await getTokenAmount(amount))
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isOverflow, current } = await checkForOverflow(amount)
    if (isOverflow) return getLastOrderAmount(current)

    // TODO: should simulate first.
    writeContract({
      abi: v3BondingCurveAbi,
      address: bondingCurve!,
      functionName: 'mint',
      chainId,
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

  const sellV3 = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const nativeAmount = formatEther(await getReserveAmount(amount))
    if (BigNumber(nativeAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    // TODO: should simulate first.
    writeContract({
      abi: v3BondingCurveAbi,
      address: bondingCurve!,
      functionName: 'burn',
      chainId,
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
    hashV3,
    isSubmittingV3,
    buyV3,
    sellV3,
    resetTradeV3,
    getReserveAmountV3: getReserveAmount,
    getTokenAmountV3: getTokenAmount,
  }
}
