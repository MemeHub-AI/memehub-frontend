import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useNftCheck } from '@/hooks/use-nft-check'
import { useAirdropInfo } from '@/hooks/airdrop/use-airdrop-info'

interface Value
  extends ReturnType<typeof useNftCheck>,
    ReturnType<typeof useAirdropInfo> {
  isOnlyOne: boolean
  isAirdropExpired: boolean
}

const Context = createContext<Value | null>(null)

export const TradeAirdropProvider = Context.Provider

export const useTradeAirdropContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('TradeAirdropProvider')
  return context
}
