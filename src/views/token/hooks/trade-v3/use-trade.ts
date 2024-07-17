import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther } from 'viem'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { DexTradeProps } from '../trade-dex/use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useTradeInfoV3 } from './use-trade-info'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { useInvite } from '../use-invite'
import { usePools } from '../use-pools'
import { utilLang } from '@/utils/lang'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { v3Addr } from '@/contract/v3/address'
import { v3BondingCurveAbi } from '@/contract/v3/abi/bonding-curve'

export const useTradeV3 = (dexProps: DexTradeProps) => {
  const { dexHash, isDexTrading, dexBuy, dexSell, dexReset } = dexProps
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { tokenAddr } = useTradeSearchParams()
  const { getReferrals } = useInvite()
  const { isGrauated } = usePools(tokenAddr, chainId)
  const { t } = useTranslation()
  const { bondingCurve } = v3Addr[chainId] ?? {}

  const {
    getNativeAmount,
    getTokenAmount,
    checkForOverflow,
    getLastOrderAmount,
  } = useTradeInfoV3()
  const {
    data: internalHash,
    isPending: isInternalTrading,
    writeContract,
    reset: resetInternalTrade,
  } = useWriteContract({
    mutation: { onError: (e) => CONTRACT_ERR.exec(e) },
  })
  const tradeHash = isGrauated ? dexHash : internalHash
  const isSubmitting = isGrauated ? isDexTrading : isInternalTrading

  const checkForTrade = (amount: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    if (!isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    if (!address || !bondingCurve) return false

    return true
  }

  const buy = async (
    amount: string,
    slippage: string,
    setValue?: (v: string) => void
  ) => {
    if (!checkForTrade(amount)) return
    if (isGrauated) return dexBuy(amount, tokenAddr, slippage)

    const nativeAmount = parseEther(amount)
    const tokenAmount = formatEther(await getTokenAmount(amount))
    if (BigNumber(tokenAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isOverflow, current } = await checkForOverflow(amount)

    if (isOverflow) {
      getLastOrderAmount(current).then((value) => {
        setValue?.(value)
        toast.warning(
          utilLang.replace(t('trade.limit'), [value, t('trade.buy')])
        )
      })
      return
    }

    console.log('v3 buy', getReferrals(), current)
    writeContract({
      abi: v3BondingCurveAbi,
      address: bondingCurve!,
      functionName: 'mint',
      chainId,
      args: [
        tokenAddr,
        nativeAmount,
        subSlippage(tokenAmount, slippage),
        address!,
        await getDeadline(),
        await getReferrals(),
      ],
      value: nativeAmount,
    })
  }

  const sell = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return
    if (isGrauated) return dexSell(amount, tokenAddr, slippage)

    const nativeAmount = formatEther(await getNativeAmount(amount))
    if (BigNumber(nativeAmount).lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    console.log('v3 sell', await getReferrals())
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

  const resetTrade = () => {
    resetInternalTrade()
    dexReset()
  }

  return {
    tradeHash,
    isSubmitting,
    buy,
    sell,
    resetTrade,

    // alias
    tradeHashV3: tradeHash,
    isSubmittingV3: isSubmitting,
    buyV3: buy,
    sellV3: sell,
    resetTradeV3: resetTrade,
  }
}
