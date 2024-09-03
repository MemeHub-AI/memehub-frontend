import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { useIdeaClaimRefund } from '../../hooks/use-claim-refund'
import { BI_ZERO } from '@/constants/number'

export const IdeaRefundClaimButton = () => {
  const { t } = useTranslation()
  const {
    idea,
    ideaStatus,
    ideaInfo,
    chainId,
    chain: { native } = {},
    ownerPercent,
    likeValue,
    userClaimAmount,
    refetchInfo,
  } = useIdeaCardContext()
  const { isCreator, isSuccess, isFailed } = ideaStatus
  const {
    isCanClaimToken,
    isClaimToken,
    isCanWithdraw,
    isWithdrawETH,
    isHasInitWithdraw,
    isInitWithdrawETH,
    initAmountIn = BI_ZERO,
  } = ideaInfo ?? {}
  const initialAmount = formatEther(initAmountIn)

  const { isPending, claim, refund, refundInitial } = useIdeaClaimRefund(
    chainId,
    idea?.memex_version,
    idea?.ido_address,
    refetchInfo
  )

  const canClaimToken = isSuccess && (isCanClaimToken || isClaimToken)
  const canRefund = isFailed && (isCanWithdraw || isWithdrawETH)
  const canRefundInitial =
    isFailed && isCreator && (isHasInitWithdraw || isInitWithdrawETH)

  const claimLabel = `${t('pure.claim')} ${
    isCreator ? `${ownerPercent}%` : BigNumber(userClaimAmount).toFormat(0)
  }  ${idea?.symbol}`

  const refundLabel = `${t('refund')} ${likeValue} ${native?.symbol}`
  const refundInitialLabel = `${t('refund-initial-buy')} ${initialAmount} ${
    native?.symbol
  }`

  return (
    <>
      {canClaimToken && (
        <Button
          variant="yellow"
          shadow="none"
          size="xs"
          className="py-3 mt-2 rounded-md"
          disabled={!isCanClaimToken || isClaimToken}
          isLoading={isPending}
          loadingChild={t('claiming')}
          onClick={(e) => {
            e.stopPropagation()
            claim()
          }}
        >
          {isClaimToken ? t('claimed') : claimLabel}
        </Button>
      )}

      {canRefund && (
        <Button
          variant="yellow"
          shadow="none"
          size="xs"
          className="py-3 mt-2 rounded-md"
          disabled={!isCanWithdraw || isWithdrawETH}
          isLoading={isPending}
          loadingChild={t('refunding')}
          onClick={(e) => {
            e.stopPropagation()
            refund()
          }}
        >
          {isInitWithdrawETH ? t('refunded') : refundLabel}
        </Button>
      )}

      {canRefundInitial && (
        <Button
          variant="yellow"
          shadow="none"
          size="xs"
          className="py-3 mt-2 rounded-md"
          disabled={!isHasInitWithdraw || isInitWithdrawETH}
          isLoading={isPending}
          loadingChild={t('refunding')}
          onClick={(e) => {
            e.stopPropagation()
            refundInitial()
          }}
        >
          {isInitWithdrawETH ? t('refunded-initial-buy') : refundInitialLabel}
        </Button>
      )}
    </>
  )
}

export default IdeaRefundClaimButton
