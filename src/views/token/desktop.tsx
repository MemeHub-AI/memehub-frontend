import Chart from '@/components/chart'
import { CommentTradeTab } from './components/comment-trade-tab'
import HoldersRank from './components/holders-rank'
import TokenInfo from './components/token-info'
import TokenInfoHeader from './components/token-info-header'
import TradeAirdrop from './components/trade-airdrop'
import TradeTab from './components/trade-tab'

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
