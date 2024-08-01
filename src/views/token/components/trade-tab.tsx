import React, { type ComponentProps, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { SlippageButton } from './slippage-button'
import { TradeProvider } from '@/contexts/trade'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'
import { useTokenContext } from '@/contexts/token'
import { useSlippage } from '../../../hooks/use-slippage'
import { useTrade } from '../hooks/use-trade'
import { useTradeBalance } from '../hooks/use-trade-balance'
import { TradeType } from '@/constants/trade'
import { useAirdropStore } from '@/stores/use-airdrop'
import { InviteTipsDialog } from './invite-tips-dialog'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { utilLang } from '@/utils/lang'
import { TradeButton } from './trade-button'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(TradeType.Buy.toString())
  const [value, setValue] = useState('')
  const [isBuy, isSell] = useMemo(
    () => [tab === TradeType.Buy, tab === TradeType.Sell],
    [tab]
  )
  const { playSuccess } = useAudioPlayer()
  const { isNotFound, isIdoToken } = useTokenContext()

  // TODO: maybe not needed.
  const { isClaimingAirdrop } = useAirdropStore()
  const { slippage, setSlippage } = useSlippage()
  const { nativeBalance, tokenBalance, refetchBalance } = useTradeBalance()
  const {
    isTrading,
    isTraded,
    inviteErrorOpen,
    setInviteErrorOpen,
    buy,
    sell,
  } = useTrade(() => {
    setValue('')
    refetchBalance()
  })
  const disabled = isTrading || isClaimingAirdrop || (isNotFound && !isIdoToken)

  const onTrade = async () => {
    if (isBuy) {
      const overflowValue = await buy(value, slippage)
      if (overflowValue) {
        setValue(overflowValue)
        toast.warning(
          utilLang.replace(t('trade.limit'), [value, t('trade.buy')])
        )
      }
      playSuccess()
      return
    }

    sell(value, slippage)
    playSuccess()
  }

  return (
    <TradeProvider
      value={{
        isBuy,
        isSell,
        isTraded,
        nativeBalance,
        tokenBalance,
        value,
      }}
    >
      <InviteTipsDialog
        open={inviteErrorOpen}
        onOpenChange={setInviteErrorOpen}
      />

      <Card
        hover="none"
        shadow="none"
        className={cn('p-3 gap-4 rounded-lg', className)}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v)
            setValue('')
          }}
        >
          <TabsList className="grid grid-cols-2 h-11 mb-3">
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Buy}
              disabled={disabled}
            >
              {t('trade.buy')}
            </TabsTrigger>
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Sell}
              disabled={disabled}
            >
              {t('trade.sell')}
            </TabsTrigger>
          </TabsList>

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
            isTrading={isTraded}
            onTrade={onTrade}
          />
        </Tabs>
      </Card>
    </TradeProvider>
  )
}

export default TradeTab
