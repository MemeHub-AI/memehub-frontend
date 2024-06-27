import React, { type ComponentProps, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, isAddress } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount, useSwitchChain } from 'wagmi'
import { isEmpty } from 'lodash'

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
import { useTradeInfo } from '../hooks/use-trade-info'
import { useUserStore } from '@/stores/use-user-store'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { TradeType } from '@/constants/trade'
import { useToastDiamond } from '@/hooks/use-toast-diamond'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(TradeType.Buy))
  const [value, setValue] = useState('')
  const [isBuy, isSell] = useMemo(
    () => [tab === TradeType.Buy, tab === TradeType.Sell],
    [tab]
  )
  const { query } = useRouter()
  const { switchChainAsync } = useSwitchChain()
  const { isConnected, chainId } = useAccount()
  const router = useRouter()

  const { slippage, setSlippage } = useSlippage()
  const { setConnectOpen } = useWalletStore()
  const { tokenInfo } = useTokenContext()
  const { copy } = useClipboard()
  const { userInfo } = useUserStore()
  const {
    isSubmitting,
    isTraded,
    inviteSelfOpen,
    setInviteSelfOpen,
    buying,
    selling,
  } = useTrade()
  const {
    nativeBalance,
    tokenBalance,
    refetchNativeBalance,
    refetchTokenBalance,
  } = useTradeInfo()
  const { toastDiamond, dismissDiamond } = useToastDiamond()

  const token = (query.address || '') as Address
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''

  const onBuy = async () => {
    // Overflow current wallet balance.
    if (BigNumber(value).gt(nativeBalance)) {
      toast.error(t('balance.illegality'))
      setValue(nativeBalance)
      return
    }

    buying(value, slippage, setValue)
  }

  const onSell = async () => {
    // Overflow current token balance.
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
    // Wallet is not connect.
    if (!isConnected) {
      setConnectOpen(true)
      return
    }

    // Token address is invalid.
    if (isEmpty(token) || !isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return
    }

    // Chain is not correct.
    const isValidChain = await checkForChain()
    if (!isValidChain) return

    isBuy ? onBuy() : onSell()
  }

  // Refresh balance when trade completed.
  useEffect(() => {
    if (!isTraded) return
    setValue('')
    refetchNativeBalance()
    refetchTokenBalance()
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
      <AlertDialog
        open={inviteSelfOpen}
        onOpenChange={setInviteSelfOpen}
        title={<span className="text-red-500">{t('invite.cycle-self')}</span>}
        content={t('invite.cycle-sef.desc')}
        confirmText={t('clear-it')}
        onConfirm={() => {
          if (router.query.r) delete router.query.r
          router.replace({
            pathname: router.pathname,
            query: router.query,
          })
        }}
      />
      <Card
        hover="none"
        shadow="none"
        className={cn('p-3 gap-4 rounded-lg', className)}
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 h-11 mb-3">
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Buy}
              disabled={isSubmitting}
            >
              {t('trade.buy')}
            </TabsTrigger>
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Sell}
              disabled={isSubmitting}
            >
              {t('trade.sell')}
            </TabsTrigger>
          </TabsList>

          {/* Slippage button */}
          <SlippageButton
            value={slippage}
            onChange={setSlippage}
            disabled={isSubmitting}
          />

          <div className="flex flex-col my-3">
            {/* Input */}
            <TradeInput
              value={value}
              onChange={setValue}
              disabled={isSubmitting}
            />

            {/* Items button */}
            <TradeItems
              disabled={isSubmitting}
              onResetClick={setValue}
              onItemClick={setValue}
            />
          </div>

          {/* Trade button */}
          <Button
            className="!w-full font-bold bg-lime-green-deep"
            onClick={onTrade}
            disabled={isSubmitting || !value || BigNumber(value).lte(0)}
          >
            {isSubmitting ? t('trading') : t('trade')}
          </Button>
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
