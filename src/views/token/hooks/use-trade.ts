import { useEffect, useState } from 'react'
import { Address, formatEther, isAddress } from 'viem'
import { isEmpty } from 'lodash'
import { useAccount } from 'wagmi'

import { useTradeV1 } from './v1/use-trade-v1'
import { useTokenContext } from '@/contexts/token'
import { useTradeToast } from '@/hooks/use-trade-toast'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { TradeType } from '@/constants/trade'
import { useInvite } from './use-invite'
import { fmt } from '@/utils/fmt'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useDexTrade } from './use-dex-trade'
import { idoTrumpCard } from '@/config/ido'
import { CONTRACT_ERR } from '@/errors/contract'
import { useChainsStore } from '@/stores/use-chains-store'

// Used for trade success tips.
const lastTrade = {
  type: '' as TradeType | '',
  tokenLabel: '',
  reserveLabel: '',
}

export const useTrade = (onSuccess?: () => void) => {
  const {
    tokenInfo,
    isIdoToken,
    isGraduated,
    tokenAddr,
    tokenMetadata,
    chainId,
  } = useTokenContext()
  const { address, pool_address, ticker } = tokenInfo ?? {}
  const { showToast } = useTradeToast()
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { getCanBind } = useInvite()
  const { evmChainsMap } = useChainsStore()
  const { chain: walletChain } = useAccount()
  const { chain } = tokenInfo ?? {}

  const { dexHash, isDexTrading, dexBuy, dexSell } = useDexTrade(
    address as Address,
    (isIdoToken ? idoTrumpCard.poolAddr : pool_address) as Address,
    chainId
  )
  const {
    hashV1: hashV1,
    isSubmittingV1: isSubmittingV1,
    buyV1,
    sellV1,
    resetTradeV1,
    getReserveAmountV1,
    getTokenAmountV1,
  } = useTradeV1()

  const hash = dexHash || hashV1
  const isTrading = isDexTrading || isSubmittingV1
  const getReserveAmount = getReserveAmountV1
  const getTokenAmount = getTokenAmountV1

  // This `useWaitForTx` only track status.
  const { isFetched: isTraded } = useWaitForTx({
    hash,
    onSuccess,
    onFillay: () => resetTrade(),
  })

  // TODO: add Sol, TON chains
  const updateLastTrade = async (type: TradeType, amount: string) => {
    const tokenSymbol = ticker || tokenMetadata?.symbol
    const reserveSymbol = evmChainsMap[chainId]?.native.symbol
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
    if (!isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    if (!tokenMetadata) {
      CONTRACT_ERR.contractAddrNotFound()
      return false
    }

    return true
  }

  const buy = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    // DEX trade, ido token with trade tax
    if (isGraduated || isIdoToken) {
      return dexBuy(amount, slippage, isIdoToken)
    }

    await updateLastTrade(TradeType.Buy, amount)
    return buyV1(amount, slippage)
  }

  const sell = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) return

    // DEX trade, ido token with trade tax
    if (isGraduated || isIdoToken) {
      return dexSell(amount, slippage, isIdoToken)
    }

    await updateLastTrade(TradeType.Sell, amount)
    return sellV1(amount, slippage)
  }

  const resetTrade = () => {
    resetTradeV1()
    // More versions...
  }

  // show trade toast
  useEffect(() => {
    if (!hash) return

    showToast({
      ...lastTrade,
      hash,
      txUrl: `${
        chain?.explorer ?? walletChain?.blockExplorers?.default.url
      }/tx/${hash}`,
    })
    resetTrade()
  }, [hash])

  return {
    hash,
    isTrading,
    isTraded,
    buy,
    sell,
    inviteOpen,
    setInviteOpen,
  }
}
