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
const lastTrade = {
  type: '' as TradeType | '',
  tokenLabel: '',
  reserveLabel: '',
}

export const useTrade = (onSuccess?: () => void) => {
  const { showToast } = useTradeToast()
  const {
    tokenInfo,
    isIdoToken,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    chainId,
    network,
    tokenChain,
  } = useTokenContext()

  const { getTokenAmount, getReserveAmount } = useTradeAmount()
  const {
    dexHash,
    isDexSubmitting,
    isDexTraded,
    dexBuy,
    dexSell,
    dexResetTrade,
  } = useDexTrade(tokenAddr, tokenInfo?.graduated_pool, chainId, { onSuccess })
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
    const tokenSymbol = tokenInfo?.symbol || tokenMetadata?.symbol
    const reserveSymbol = tokenChain?.native.symbol

    if (type === TradeType.Buy) {
      const [, tokenAmount] = await getTokenAmount(inputAmount)
      lastTrade.tokenLabel = `${tokenAmount} ${tokenSymbol}`
      lastTrade.reserveLabel = `${inputAmount} ${reserveSymbol}`
    } else {
      const [, reserveAmount] = await getReserveAmount(inputAmount)
      lastTrade.tokenLabel = `${inputAmount} ${tokenSymbol}`
      lastTrade.reserveLabel = `${reserveAmount} ${reserveSymbol}`
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

    // DEX/ido trade
    if (isGraduated || isIdoToken) {
      return dexBuy(amount, slippage, isIdoToken)
    }

    // TODO: should update before `dexBuy`
    await updateLastTrade(TradeType.Buy, amount)
    return buy(amount, slippage)
  }

  const handleSell = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    // DEX/ido trade
    if (isGraduated || isIdoToken) {
      return dexSell(amount, slippage, isIdoToken)
    }

    // TODO: should update before `dexSell`
    await updateLastTrade(TradeType.Sell, amount)
    return sell(amount, slippage)
  }

  const handleResetTrade = () => {
    resetTrade()
    dexResetTrade()
  }

  // show trade toast
  useEffect(() => {
    if (!hash) return

    showToast({
      ...lastTrade,
      hash,
      txUrl: `${tokenChain?.explorer}/tx/${hash}`,
    })
    handleResetTrade()
  }, [hash])

  return {
    hash,
    isTrading: isSubmitting || isDexSubmitting,
    isTraded: isTraded || isDexTraded,
    handleBuy,
    handleSell,
  }
}
