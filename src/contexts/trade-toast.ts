import { createContext, useContext } from 'react'

import { TxStatusProps } from '@/components/trade-toast/tx-status'
import { CONTEXT_ERR } from '@/errors/context'

interface Value extends TxStatusProps {}

const Context = createContext<Value | null>(null)

export const TradeToastProvider = Context.Provider

export const useTradeToastContext = () => {
  const context = useContext(Context)
  if (!context) throw CONTEXT_ERR.notFound('TradeToastProvider')

  return context
}
