import React, { type ComponentProps, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, isAddress } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount, useSwitchChain } from 'wagmi'
import { isEmpty } from 'lodash'
import { useDebounce } from 'react-use'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useWalletStore } from '@/stores/use-wallet-store'
import { SlippageButton } from './slippage-button'
import { TradeProvider } from '@/contexts/trade'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'
import { useTokenContext } from '@/contexts/token'
import { useSlippage } from '../hooks/use-slippage'
import { useClipboard } from '@/hooks/use-clipboard'
import { INVITE_REWARD } from '@/constants/invite'
import { useTrade } from '../hooks/use-trade'
import { useTradeBalance } from '../hooks/use-trade-balance'
import { useUserStore } from '@/stores/use-user-store'
import { TradeType } from '@/constants/trade'
import { useAirdropStore } from '@/stores/use-airdrop'
import { InviteTipsDialog } from './invite-tips-dialog'
import { TradeCommentDialog } from './trade-comment-dialog'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(TradeType.Buy))
  const [value, setValue] = useState('')
  const [isBuy, isSell] = useMemo(
    () => [tab === TradeType.Buy, tab === TradeType.Sell],
    [tab]
  )
  const { query, ...router } = useRouter()
  const { switchChainAsync } = useSwitchChain()
  const { isConnected, chainId } = useAccount()
  const { isClaimingAirdrop } = useAirdropStore()

  const { slippage, setSlippage } = useSlippage()
  const { setConnectOpen } = useWalletStore()
  const { tokenInfo } = useTokenContext()
  const { copy } = useClipboard()
  const { userInfo } = useUserStore()
  const { isSubmitting, isTraded, inviteOpen, setInviteOpen, buying, selling } =
    useTrade()
  const { nativeBalance, tokenBalance, refetchBalance } = useTradeBalance()

  const [isBalanceOverflow, setIsBalanceOverflow] = useState(false)

  const token = (query.address || '') as Address
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''
  const disabled = isSubmitting || isClaimingAirdrop
  const disableTrade =
    disabled || !value || BigNumber(value).lte(0) || isBalanceOverflow

  const onBuy = async () => {
    // Check native token balance.
    if (BigNumber(value).gt(nativeBalance)) {
      toast.error(t('balance.illegality'))
      setValue(nativeBalance)
      return
    }

    buying(value, slippage, setValue)
  }

  const onSell = async () => {
    // Check token balance.
    if (BigNumber(value).gt(tokenBalance)) {
      toast.error(t('balance.illegality'))
      return
    }

    selling(value, slippage)
  }

  const checkForChain = async () => {
    if (!chainId || !tokenInfo?.chain.id) return false

    const tokenChainId = Number(tokenInfo?.chain.id)
    if (chainId === tokenChainId) return true

    try {
      await switchChainAsync({ chainId: tokenChainId })
      return true
    } catch (error) {
      toast.error(t('chain-error'))
      return false
    }
  }

  const onTrade = async () => {
    // Check wallet connect.
    if (!isConnected) {
      setConnectOpen(true)
      return
    }

    // Check token addr.
    if (isEmpty(token) || !isAddress(token)) {
      toast.error(t('contract.err.token-addr'))
      return
    }

    // Check chain.
    const isValidChain = await checkForChain()
    if (!isValidChain) return

    isBuy ? onBuy() : onSell()
  }

  const checkForOverflow = () => {
    if (isBuy) {
      setIsBalanceOverflow(BigNumber(value).gt(nativeBalance))
    } else {
      setIsBalanceOverflow(BigNumber(value).gt(tokenBalance))
    }
  }

  useDebounce(checkForOverflow, 300, [value])

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

      <Card
        hover="none"
        shadow="none"
        className={cn('p-3 gap-4 rounded-lg', className)}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setValue('')
            setTab(v)
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

          {/* Slippage button */}
          <SlippageButton
            value={slippage}
            onChange={setSlippage}
            disabled={disabled}
          />

          <div className="flex flex-col my-3">
            {/* Input */}
            <TradeInput value={value} onChange={setValue} disabled={disabled} />

            {/* Items button */}
            <TradeItems
              disabled={disabled}
              onResetClick={setValue}
              onItemClick={setValue}
            />
          </div>

          {/* Trade button */}
          <TradeCommentDialog onTrade={onTrade}>
            <Button
              className="!w-full font-bold bg-lime-green-deep"
              disabled={disableTrade}
            >
              {isBalanceOverflow
                ? t('balance.insufficient')
                : isSubmitting
                ? t('trading')
                : t('trade')}
            </Button>
          </TradeCommentDialog>
          {isConnected && (
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
