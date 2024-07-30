import React, { type ComponentProps, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { SlippageButton } from './slippage-button'
import { TradeProvider } from '@/contexts/trade'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'
import { useTokenContext } from '@/contexts/token'
import { useSlippage } from '../../../hooks/use-slippage'
import { useClipboard } from '@/hooks/use-clipboard'
import { INVITE_REWARD } from '@/constants/invite'
import { useTrade } from '../hooks/use-trade'
import { useTradeBalance } from '../hooks/use-trade-balance'
import { useUserStore } from '@/stores/use-user-store'
import { TradeType } from '@/constants/trade'
import { useAirdropStore } from '@/stores/use-airdrop'
import { InviteTipsDialog } from './invite-tips-dialog'
import { TradeCommentDialog } from './trade-comment-dialog'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useTradeSearchParams } from '../hooks/use-search-params'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { utilLang } from '@/utils/lang'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(TradeType.Buy))
  const [value, setValue] = useState('')
  const [commentOpen, setCommentOpen] = useState(false)
  const [isBuy, isSell] = useMemo(
    () => [tab === TradeType.Buy, tab === TradeType.Sell],
    [tab]
  )
  const { isClaimingAirdrop } = useAirdropStore()
  const { tokenAddr } = useTradeSearchParams()

  const { slippage, setSlippage } = useSlippage()
  const { tokenInfo, isNotFound, isIdoToken } = useTokenContext()
  const { copy } = useClipboard()
  const { userInfo } = useUserStore()
  const { isTrading, isTraded, inviteOpen, setInviteOpen, buying, selling } =
    useTrade()
  const { nativeBalance, tokenBalance, refetchBalance } = useTradeBalance()
  const { isConnected, checkForChain, checkForConnect } = useCheckAccount()

  const balance = isBuy ? nativeBalance : tokenBalance
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''
  const disableTrade =
    isTrading || isClaimingAirdrop || (isNotFound && !isIdoToken)
  const disableButton =
    disableTrade ||
    !value ||
    BigNumber(value).lte(0) ||
    BigNumber(value).gt(balance)

  const { playError, playSuccess } = useAudioPlayer()

  const checkForTrade = () => {
    if (!checkForConnect()) return false
    if (isEmpty(tokenAddr) || !isAddress(tokenAddr)) {
      toast.error(t('contract.err.token-addr'))
      playError()
      return false
    }
    if (BigNumber(value).gt(balance)) {
      toast.error(t('balance.illegality'))
      playError()
      setValue(nativeBalance)
      return false
    }

    return true
  }

  const onTrade = async () => {
    if (!checkForTrade()) return
    if (isBuy) {
      const overflowValue = await buying(value, slippage)
      if (overflowValue) {
        setValue(overflowValue)
        toast.warning(
          utilLang.replace(t('trade.limit'), [value, t('trade.buy')])
        )
      }
      playSuccess()
      return
    }

    selling(value, slippage)
    playSuccess()
  }

  const renderButtonText = () => {
    if (BigNumber(value).gt(balance)) {
      return t('balance.insufficient')
    }
    if (isTrading) return t('trading')

    return t('trade')
  }

  // Refresh balance when trade completed.
  useEffect(() => {
    if (!isTraded) return
    setValue('')
    refetchBalance()
  }, [isTraded])

  return (
    <TradeProvider
      value={{
        isBuy,
        isSell,
        isTraded,
        nativeSymbol,
        nativeBalance,
        tokenBalance,
      }}
    >
      <InviteTipsDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <TradeCommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        onTrade={onTrade}
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
              disabled={disableTrade}
            >
              {t('trade.buy')}
            </TabsTrigger>
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Sell}
              disabled={disableTrade}
            >
              {t('trade.sell')}
            </TabsTrigger>
          </TabsList>

          {/* Slippage button */}
          <SlippageButton
            value={slippage}
            onChange={setSlippage}
            disabled={disableTrade}
          />

          <div className="flex flex-col my-3">
            {/* Input */}
            <TradeInput
              value={value}
              onChange={setValue}
              disabled={disableTrade}
            />

            {/* Items button */}
            <TradeItems
              disabled={disableTrade}
              onResetClick={setValue}
              onItemClick={setValue}
            />
          </div>

          {/* Trade button */}
          {isConnected ? (
            <Button
              className="!w-full font-bold bg-lime-green-deep"
              disabled={disableButton}
              onClick={async () => {
                if (!(await checkForChain(tokenInfo?.chain.id))) return
                if (isIdoToken) return onTrade()
                setCommentOpen(true)
              }}
            >
              {renderButtonText()}
            </Button>
          ) : (
            <Button
              className="!w-full font-bold bg-lime-green-deep"
              onClick={() => checkForConnect}
            >
              {t('wallet.connect')}
            </Button>
          )}
          {isConnected && !isIdoToken && (
            <>
              <Button
                className="!w-full font-bold mt-3"
                onClick={() => {
                  copy(
                    location.origin + location.pathname + `?r=${userInfo?.code}`
                  )
                }}
              >
                {t('referral.copy')}
              </Button>
              <p className="text-xs text-zinc-500 mt-3">
                {t('referral.desc').split('$')[0]}
                {INVITE_REWARD}%{t('referral.desc').split('$')[1]}
              </p>
            </>
          )}
        </Tabs>
      </Card>
    </TradeProvider>
  )
}

export default TradeTab
