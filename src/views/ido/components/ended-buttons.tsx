import React from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { formatEther } from 'viem'

import { Button } from '@/components/ui/button'
import { useIdoContext } from '@/contexts/ido'
import { useIdo } from '../hooks/use-ido'
import { idoAbi } from '@/contract/v3/abi/ido'
import { v3Addr } from '@/contract/v3/address'
import { BI_ZERO } from '@/constants/number'
import { fmt } from '@/utils/fmt'

export const EndedButtons = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const {
    userAmount,
    reserveSymbol,
    isCanceled,
    chainId,
    poolId,
    refetchIdoInfo,
  } = useIdoContext()
  const { isLoading, claim, refund } = useIdo(refetchIdoInfo)

  const { data: tokenAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getClaimTokenAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const { data: reserveAmountWei = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getClaimEthAmount',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const tokenAmount = formatEther(tokenAmountWei)
  const reserveAmount = formatEther(reserveAmountWei)

  const { data: isClaimedToken } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getIsClaimedToken',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })
  const { data: isClaimedEth } = useReadContract({
    abi: idoAbi,
    address: v3Addr[chainId]?.ido,
    functionName: 'getIsClaimedEth',
    args: [BigInt(poolId), address!],
    query: { enabled: !!address },
  })

  if (BigNumber(userAmount).isZero()) return

  return (
    <>
      <div className="flex items-center space-x-2 mt-3">
        {!isCanceled && (
          <Button
            className="bg-yellow-200"
            shadow="none"
            disabled={
              isLoading || isClaimedToken || BigNumber(tokenAmount).lte(0)
            }
            onClick={() => claim()}
          >
            {t('ido.claim')} {BigNumber(tokenAmount).toFormat()} LP
          </Button>
        )}
        <Button
          shadow="none"
          disabled={
            isLoading || isClaimedEth || BigNumber(reserveAmount).lte(0)
          }
          onClick={() => refund()}
        >
          {t('ido.refund')} {fmt.decimals(reserveAmount)} {reserveSymbol}
        </Button>
      </div>
    </>
  )
}

export default EndedButtons
