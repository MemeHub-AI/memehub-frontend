import { useEffect, useMemo, useState } from 'react'
import { formatEther, isAddress } from 'viem'
import { isEmpty } from 'lodash'

import { useEvmTrade } from './evm/use-trade'
import { useTokenContext } from '@/contexts/token'
import { useTradeToast } from '@/hooks/use-trade-toast'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { TradeType } from '@/enums/trade'
import { useInvite } from './use-invite'
import { fmt } from '@/utils/fmt'
import { useDexTrade } from './use-dex-trade'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainsStore } from '@/stores/use-chains-store'
import { Network } from '@/enums/contract'

// Used for trade success tips.
const lastTrade = {
  type: '' as TradeType | '',
  tokenLabel: '',
  reserveLabel: '',
}

export const useTrade = (onSuccess?: () => void) => {
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { getCanBind } = useInvite()
  const { showToast } = useTradeToast()

  const {
    tokenInfo,
    isIdoToken,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    chainId,
    chainName,
    network,
    tokenChain,
  } = useTokenContext()
  const { chainsMap } = useChainsStore()

  const {
    dexHash,
    isDexSubmitting,
    isDexTraded,
    dexBuy,
    dexSell,
    dexResetTrade,
  } = useDexTrade(tokenAddr, tokenInfo?.graduated_pool, chainId)
  const evmTrade = useEvmTrade(onSuccess)

  const {
    hash,
    isTraded,
    isSubmitting,
    buy,
    sell,
    getReserveAmount,
    getTokenAmount,
    resetTrade,
  } = useMemo(() => {
    return {
      [Network.Evm]: evmTrade,
      [Network.Svm]: evmTrade,
      [Network.Tvm]: evmTrade,
    }[network]
  }, [network, isGraduated, isIdoToken, evmTrade])

  // TODO: add Sol, TON chains
  const updateLastTrade = async (type: TradeType, amount: string) => {
    const tokenSymbol = tokenInfo?.symbol || tokenMetadata?.symbol
    const reserveSymbol = chainsMap[chainName]?.native.symbol
    lastTrade.type = type

    const getNonFixedLabel = (value: bigint, symbol?: string) =>
      `${fmt.decimals(formatEther(value))} ${symbol ?? ''}`

    const getFixedLabel = (value: string, symbol?: string) =>
      `${fmt.decimals(value, {
        fixed: 3,
      })} ${symbol}`

    if (type === TradeType.Buy) {
      lastTrade.tokenLabel = getNonFixedLabel(
        await getTokenAmount(amount),
        tokenSymbol
      )
      lastTrade.reserveLabel = getFixedLabel(amount, reserveSymbol)
    } else {
      lastTrade.tokenLabel = getFixedLabel(amount, tokenSymbol)
      lastTrade.reserveLabel = getNonFixedLabel(
        await getReserveAmount(amount),
        reserveSymbol
      )
    }
  }

  const checkForTrade = async (amount: string) => {
    // Cannot use self code to trade.
    if (userInfo?.code === referralCode) {
      setInviteOpen(true)
      return false
    }
    // Backend check.
    if (!(await getCanBind(referralCode))) {
      setInviteOpen(true)
      return false
    }
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

    await updateLastTrade(TradeType.Buy, amount)
    return buy(amount, slippage)
  }

  const handleSell = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    // DEX/ido trade
    if (isGraduated || isIdoToken) {
      return dexSell(amount, slippage, isIdoToken)
    }

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
    hash: hash || dexHash,
    isTrading: isSubmitting || isDexSubmitting,
    isTraded: isTraded || isDexTraded,
    handleBuy,
    handleSell,
    inviteOpen,
    setInviteOpen,
  }
}
