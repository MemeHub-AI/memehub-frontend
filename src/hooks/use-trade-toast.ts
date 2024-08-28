import { createElement } from 'react'
import { toast } from 'sonner'
import { type Hash } from 'viem'
import { BigNumber } from 'bignumber.js'

import { TradeType } from '@/enums/trade'
import { TxStatus } from '@/components/trade-toast/tx-status'
import { useTokenContext } from '@/contexts/token'
import { useChainInfo } from './use-chain-info'
import { fmt } from '@/utils/fmt'

interface Options {
  hash: Hash
  type: TradeType
  reserveAmount: string
  tokenAmount: string
}

export const useTradeToast = () => {
  const { chainName, rewardInfo, tradePrice, tokenInfo, isGraduated } =
    useTokenContext()
  const { chain: { explorer, native } = {} } = useChainInfo(chainName)

  const getRewardAmount = (type: TradeType, reserveAmount: string) => {
    if (isGraduated) return '0'

    const { amount_unit = 0, usd_unit = 0 } = rewardInfo?.[type] ?? {}
    const { price = 0 } = tradePrice ?? {}
    const reward = BigNumber(reserveAmount)
      .multipliedBy(price)
      .multipliedBy(amount_unit)
      .div(usd_unit)

    return reward.isNaN() ? '0' : reward.toFixed()
  }

  const showToast = async ({
    hash,
    type,
    reserveAmount,
    tokenAmount,
  }: Options) => {
    const toastId = toast(
      createElement(TxStatus, {
        hash,
        tokenLabel: `${fmt.decimals(tokenAmount)} ${tokenInfo?.symbol}`,
        reserveLabel: `${fmt.decimals(reserveAmount)} ${native?.symbol}`,
        reward: getRewardAmount(type, reserveAmount),
        isBuy: type === TradeType.Buy,
        txUrl: `${explorer}/tx/${hash}`,
        getToastId: () => toastId,
      }),
      {
        position: 'bottom-left',
        className: 'w-100 moving-element',
        duration: 1800_000, // 30m
        style: {
          transition:
            'transformY 0s,transformX .4s,opacity .4s,height .4s,box-shadow .2s',
        },
      }
    )
    return toastId
  }

  return {
    showToast,
  }
}
