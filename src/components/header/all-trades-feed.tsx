import { memo, useEffect, useState } from 'react'

import { TokenSearchInput } from '@/components/token/search-input'
import { useAllTrades } from '@/hooks/use-all-traces'
import {
  TokenWsCreate,
  TokenWsTrade,
} from '@/views/token/hooks/use-token-ws/types'
import TradeShake from './trade-shake'
import CreateCoinShake from './create-coin-shake'

export const AllTradesFeeds = memo(() => {
  // const colors = utilColor.randomCreate()
  const { allTrades, coinCreate } = useAllTrades()
  const [trade, setTrade] = useState<TokenWsTrade>()
  const [create, setCreate] = useState<TokenWsCreate>()

  const colors = [
    '#9390b8',
    '#a0968c',
    '#b587d6',
    '#8cc386',
    '#b4351f',
    '#b8a78c',
    '#80ade5',
  ]

  const randomIdx = Math.floor(Math.random() * colors.length)

  useEffect(() => {
    if (allTrades.length !== 0) {
      return setTrade(allTrades[0])
    }
  }, [allTrades])

  useEffect(() => {
    if (coinCreate !== undefined) {
      return setCreate(coinCreate)
    }
  }, [coinCreate])

  return (
    <div className="flex justify-between flex-1 mr-2 ml-6 mt-2">
      <div className="flex flex-col items-start space-y-2">
        {trade && <TradeShake color={colors[randomIdx]} trade={trade} />}
        {create && (
          <CreateCoinShake
            color="#93c5fd"
            trade={create}
            className="max-xl:hidden"
          />
        )}
      </div>

      {/* <TokenSearchInput /> */}
    </div>
  )
})

export default AllTradesFeeds
