import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther } from 'viem'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { useInvite } from '../use-invite'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'
import { tokenAbiMap } from '@/contract/abi/token'

export const useTradeV3 = () => {
  const { address } = useAccount()
  // const { chainId } = useChainInfo()
  // const { tokenAddr } = useTradeSearchParams()
  const chainId = 97
  const tokenAddr = '0x3b3497Ec50062f2983D29493c45fACaED3f757DD'
  const { getReferrals } = useInvite()

  const tokenConfig = {
    abi: tokenAbiMap['0.2.0'],
    address: tokenAddr,
  } as const

  const { data: tokenVersion } = useReadContract({
    ...tokenConfig,
    chainId,
    functionName: 'versions',
  })
  const { data: bondingVersion } = useReadContract({
    ...tokenConfig,
    chainId,
    functionName: 'bondVersion',
  })
  const { data: bondingCurveAddr } = useReadContract({
    ...tokenConfig,
    chainId,
    functionName: 'bond',
  })
  const { data: airdropVersion } = useReadContract({
    ...tokenConfig,
    chainId,
    functionName: 'distributorVersion',
  })
  const { data: airdropAddr } = useReadContract({
    ...tokenConfig,
    chainId,
    functionName: 'distributor',
  })
  console.log('version & addr', {
    bondingVersion,
    bondingCurveAddr,
    airdropVersion,
    airdropAddr,
    tokenVersion,
    tokenAddr,
  })

  const {
    getReserveAmount,
    getTokenAmount,
    checkForOverflow,
    getLastOrderAmount,
  } = useTradeInfoV3(tokenAddr)
  const {
    data: hashV3,
    isPending: isSubmittingV3,
    writeContract,
    reset: resetTradeV3,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
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
    if (!bondingCurveAddr) {
      CONTRACT_ERR.contractAddrNotFound()
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
      abi: bondingCurveAbiMap['0.1.0'], // TODO: match version
      address: bondingCurveAddr!,
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
      abi: bondingCurveAbiMap['0.1.0'],
      address: bondingCurveAddr!,
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
