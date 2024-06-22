import { useState } from 'react'

export const useTradeV3 = () => {
  const [isListed, setIsListed] = useState(false)

  const tradeHash = ''
  const isSubmitting = false
  const isTrading = false
  const isTraded = false

  const buy = () => {}

  const sell = () => {}

  const resetTrade = () => {}

  return {
    tradeHash,
    isSubmitting,
    isTrading,
    isTraded,
    buy,
    sell,
    resetTrade,
  }
}
