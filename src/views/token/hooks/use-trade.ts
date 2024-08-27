import { useEffect, useMemo } from 'react'
import { isAddress } from 'viem'
import { isEmpty } from 'lodash'

import { useEvmTrade } from './evm/use-evm-trade'
import { useTokenContext } from '@/contexts/token'
import { useTradeToast } from '@/hooks/use-trade-toast'
import { TradeType } from '@/enums/trade'
import { useDexTrade } from './use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { Network } from '@/enums/contract'
import { useTradeAmount } from './use-trade-amount'

// Used for trade success tips.
export const lastTrade = {
  type: '' as TradeType,
  tokenAmount: '',
  reserveAmount: '',
}

export const useTrade = (onSuccess?: () => void) => {
  const {
    isIdoToken,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    chainId,
    network,
    graduatedPool,
  } = useTokenContext()
  const { showToast } = useTradeToast()

  const { getTokenAmount, getReserveAmount } = useTradeAmount()
  const { dexHash, isDexSubmitting, isDexTraded, dexBuy, dexSell } =
    useDexTrade(tokenAddr, graduatedPool, chainId, { onSuccess })
  const evmTrade = useEvmTrade(onSuccess)

  const {
    hash: tradeHash,
    isTraded,
    isSubmitting,
    buy,
    sell,
    resetTrade,
  } = useMemo(() => {
    return {
      [Network.Evm]: evmTrade,
      [Network.Svm]: evmTrade,
      [Network.Tvm]: evmTrade,
    }[network]
  }, [network, isGraduated, isIdoToken, evmTrade])
  const hash = dexHash || tradeHash

  // TODO: add Sol, TON chains
  const updateLastTrade = async (type: TradeType, inputAmount: string) => {
    lastTrade.type = type
    if (type === TradeType.Buy) {
      const [, tokenAmount] = await getTokenAmount(inputAmount)
      lastTrade.tokenAmount = tokenAmount
      lastTrade.reserveAmount = inputAmount
    } else {
      const [, reserveAmount] = await getReserveAmount(inputAmount)
      lastTrade.tokenAmount = inputAmount
      lastTrade.reserveAmount = reserveAmount
    }
  }

  const checkForTrade = async (amount: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    // TODO: add Sol, Ton
    if (!isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    // TODO: add Sol, Ton
    if (!tokenMetadata) {
      CONTRACT_ERR.contractAddrNotFound()
      return false
    }

    return true
  }

  const handleBuy = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    await updateLastTrade(TradeType.Buy, amount)

    // DEX/ido trade
    if (isGraduated || isIdoToken) {
      return dexBuy(amount, slippage, isIdoToken)
    }

    return buy(amount, slippage)
  }

  const handleSell = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    await updateLastTrade(TradeType.Sell, amount)

    // DEX/ido trade
    if (isGraduated || isIdoToken) {
      return dexSell(amount, slippage, isIdoToken)
    }

    return sell(amount, slippage)
  }

  // show trade toast
  useEffect(() => {
    if (!hash) return

    showToast({ hash, ...lastTrade })
  }, [hash])

  return {
    hash,
    isTrading: isSubmitting || isDexSubmitting,
    isTraded: isTraded || isDexTraded,
    handleBuy,
    handleSell,
  }
}
