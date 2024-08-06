import React, { type ComponentProps, useState } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SlippageButton } from './slippage-button'
import { TradeTabsProvider } from '@/contexts/trade-tabs'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'
import { useTokenContext } from '@/contexts/token'
import { useSlippage } from '@/hooks/use-slippage'
import { useTrade } from '../../hooks/use-trade'
import { useTradeBalance } from '../../hooks/use-trade-balance'
import { TradeType } from '@/constants/trade'
import { InviteTipsDialog } from './invite-tips-dialog'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { TradeButton } from './trade-button'
import { TradeTabs } from './trade-tabs'
import { useAirdropStore } from '@/stores/use-airdrop'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const [tab, setTab] = useState(TradeType.Buy.toString())
  const isBuy = tab === TradeType.Buy
  const [value, setValue] = useState('')

  const { playSuccess } = useAudioPlayer()
  const { isClaimingAirdrop } = useAirdropStore()
  const { slippage, setSlippage } = useSlippage()
  const { isNotFound, isIdoToken, tokenMetadata } = useTokenContext()
  const { nativeBalance, tokenBalance, refetchBalance } = useTradeBalance()
  const {
    isTrading,
    isTraded,
    inviteOpen,
    setInviteOpen,
    handleBuy,
    handleSell,
  } = useTrade(() => {
    setValue('')
    refetchBalance()
  })
  const disabled =
    isTrading ||
    isClaimingAirdrop ||
    (isNotFound && !isIdoToken && !tokenMetadata)

  return (
    <TradeTabsProvider
      value={{
        isBuy,
        isTraded,
        nativeBalance,
        tokenBalance,
        value,
        disabled,
      }}
    >
      <InviteTipsDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <Card
        hover="none"
        shadow="none"
        className={cn('p-3 gap-4 rounded-lg', className)}
      >
        <TradeTabs
          value={tab}
          onValueChange={(v) => {
            setTab(v)
            setValue('')
          }}
        >
          <SlippageButton
            value={slippage}
            onChange={setSlippage}
            disabled={disabled}
          />

          <div className="flex flex-col my-3">
            <TradeInput value={value} onChange={setValue} disabled={disabled} />
            <TradeItems disabled={disabled} onItemClick={setValue} />
          </div>

          <TradeButton
            disabled={disabled}
            isTrading={isTrading}
            onTrade={() => {
              isBuy ? handleBuy(value, slippage) : handleSell(value, slippage)
              playSuccess()
            }}
          />
        </TradeTabs>
      </Card>
    </TradeTabsProvider>
  )
}

export default TradeTab
