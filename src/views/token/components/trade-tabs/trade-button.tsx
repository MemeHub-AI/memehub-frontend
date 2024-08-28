import React, { type ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { ConnectWallet } from '@/components/connect-wallet'
import { Button } from '@/components/ui/button'
import { useTradeTabsContext } from '@/contexts/trade-tabs'
import { useTokenContext } from '@/contexts/token'
import { TradeCommentDialog } from '../trade-comment-dialog'
import { inviteRewardPercet } from '@/config/reward'
import { useClipboard } from '@/hooks/use-clipboard'
import { useUserStore } from '@/stores/use-user-store'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useAudioPlayer } from '@/hooks/use-audio-player'

interface Props {
  onTrade: () => void
  isTrading?: boolean
}

export const TradeButton = ({
  disabled,
  isTrading,
  onTrade,
}: ComponentProps<typeof Button> & Props) => {
  const { t } = useTranslation()
  const [commentOpen, setCommentOpen] = useState(false)
  const { copy } = useClipboard()
  const { userInfo } = useUserStore()
  const { checkForChain } = useCheckAccount()
  const { playError } = useAudioPlayer()

  const { isIdoToken, isNotFound, chainId, tokenMetadata } = useTokenContext()
  const {
    isBuy,
    reserveBalance: nativeBalance,
    tokenBalance,
    value,
  } = useTradeTabsContext()
  const isBalanceInsufficient = BigNumber(value).gt(
    isBuy ? nativeBalance : tokenBalance
  )

  const onTradeClick = async () => {
    if (!(await checkForChain(chainId))) {
      playError()
      return false
    }
    if (isIdoToken || (isNotFound && tokenMetadata)) return onTrade()
    setCommentOpen(true)
  }

  return (
    <>
      <TradeCommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        onTrade={onTrade}
      />

      <ConnectWallet className="font-bold bg-lime-green-deep w-full">
        <Button
          className="!w-full font-bold bg-lime-green-deep"
          disabled={
            disabled ||
            !value ||
            BigNumber(value).lte(0) ||
            isBalanceInsufficient
          }
          onClick={onTradeClick}
        >
          {isBalanceInsufficient
            ? t('balance.insufficient')
            : isTrading
            ? t('trading')
            : t('trade')}
        </Button>

        {!isIdoToken && (
          <>
            <Button
              type="button"
              className="!w-full font-bold mt-3"
              onClick={() =>
                copy(
                  `${location.origin}${location.pathname}?r=${userInfo?.code}`
                )
              }
            >
              {t('referral.copy')}
            </Button>
            <p className="text-xs text-zinc-500 mt-3">
              {t('referral.desc').split('$')[0]}
              {inviteRewardPercet}%{t('referral.desc').split('$')[1]}
            </p>
          </>
        )}
      </ConnectWallet>
    </>
  )
}

export default TradeButton
