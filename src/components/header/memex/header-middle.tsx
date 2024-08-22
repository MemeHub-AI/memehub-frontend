import SearchInput from '@/components/search-input'
import { useAllTrades } from '@/hooks/use-all-traces'
import { utilColor } from '@/utils/color'
import { TokenCreate, TokenTrade } from '@/views/token/hooks/use-token-ws/types'
import { memo, useEffect, useState } from 'react'
import TradeShake from './trade-shake'
import CreateCoinShake from './create-coin-shake'

const MemexHeaderMiddle = () => {
  const colors = utilColor.randomCreate()
  const { allTrades, coinCreate } = useAllTrades()
  const [trade, setTrade] = useState<TokenTrade>()
  const [create, setCreate] = useState<TokenCreate>()

  useEffect(() => {
    console.log('all trades: ', allTrades)

    if (allTrades.length !== 0) {
      return setTrade(allTrades[0])
    }

    if (coinCreate !== undefined) {
      return setCreate(coinCreate)
    }
  }, [allTrades, coinCreate])

  return (
    <div className="flex justify-between flex-1 mr-4">
      <div className="flex items-center space-x-2">
        {trade && <TradeShake color={colors[1]} trade={trade} />}
        {create && (
          <CreateCoinShake
            color="#93c5fd"
            trade={create}
            className="max-xl:hidden"
          />
        )}
      </div>

      <SearchInput />
    </div>
  )
}

export default memo(MemexHeaderMiddle)
