import { Chart } from '@/components/chart'
import { CommentTradeTab } from './comment-trade-tab'
import { HoldersRank } from './holders-rank'
import { TokenInfo } from './token-info'
import { TokenInfoHeader } from './token-info-header'
import { TradeAirdrop } from './trade-airdrop'
import { TradeTab } from './trade-tab'

export const TokenDesktop = () => {
  return (
    <>
      <div className="flex flex-col flex-1">
        <TokenInfoHeader />
        <Chart />

        <TradeAirdrop />
        <CommentTradeTab />
      </div>

      <div className="w-aside">
        <TradeTab />
        <TokenInfo />
        <HoldersRank />
      </div>
    </>
  )
}
