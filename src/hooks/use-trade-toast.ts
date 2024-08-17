import { createElement } from 'react'
import { toast } from 'sonner'
import { type Hash } from 'viem'
import { BigNumber } from 'bignumber.js'

import { TradeType } from '@/enums/trade'
import { TxStatus } from '@/components/trade-toast/tx-status'
import { useTokenContext } from '@/contexts/token'

interface Options {
  hash: Hash
  txUrl: string
  type: TradeType | ''
  reserveLabel: string
  tokenLabel: string
}

export const useTradeToast = () => {
  const { tardeRewards } = useTokenContext()

  // TODO: adapt multi times trade
  const getRewardAmount = () => {
    const amount = BigNumber(tardeRewards).toNumber()
    const rewardAmount = Number(
      amount < 100 ? amount.toFixed(4) : amount.toFixed(2)
    )

    return rewardAmount
  }

  const showToast = async (options: Options) => {
    const { type, tokenLabel, reserveLabel, hash, txUrl } = options
    const toastId = toast(
      createElement(TxStatus, {
        hash,
        txUrl,
        isBuy: type === TradeType.Buy,
        tokenLabel,
        reserveLabel,
        getToastId: () => toastId,
        getRewardAmount,
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
