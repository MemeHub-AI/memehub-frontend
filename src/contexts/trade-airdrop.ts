import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'

interface Value extends ReturnType<typeof useAirdropInfo> {
  isOnlyOne: boolean
}

const Context = createContext<Value | null>(null)

export const TradeAirdropProvider = Context.Provider

export const useTradeAirdropContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('TradeAirdropProvider')
  return context
}
