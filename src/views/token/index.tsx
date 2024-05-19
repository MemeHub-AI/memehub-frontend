import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useReadContracts } from 'wagmi'
import { Address, formatEther } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { TradeTab } from './components/trade-tab'
import { Button } from '@/components/ui/button'
import { TokenInfo } from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import { useResponsive } from '@/hooks/use-responsive'
import { HoldersRank } from './components/holders-rank'
import { TokenProvider } from '@/contexts/token'
import { continousTokenAbi } from '@/contract/continous-token'
import { tokenApi } from '@/api/token'

export const TokenPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { data = [], refetch } = useReadContracts({
    contracts: [
      {
        abi: continousTokenAbi,
        address: router.query.address as Address,
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: continousTokenAbi,
        address: router.query.address as Address,
        functionName: 'raiseEthAmount',
      },
    ],
  })
  const weiTotal = data[0]?.result || BigInt(0)
  const weiCurrent = data[1]?.result || BigInt(0)
  const total = formatEther(weiTotal)
  const current = formatEther(weiCurrent)

  const { data: { data: tokenData } = {} } = useQuery({
    queryKey: [tokenApi.details.name, router.query.id],
    queryFn: () => tokenApi.details(router.query.id as string),
  })

  return (
    <TokenProvider
      total={total}
      current={current}
      tokenInfo={tokenData}
      refetchInfo={refetch}
    >
      <main className="px-4 max-sm:px-3 pt-4 max-w-main mx-auto">
        <Button className="mb-3 self-start" onClick={router.back}>
          {t('back')}
        </Button>
        <div className="flex space-x-4 max-sm:flex-col max-sm:space-x-0 mt-4">
          {/* Left */}
          <div className="flex flex-col flex-1">
            {isMobile && <TradeTab />}
            <TokenInfo className="mt-0" />
            <CommentTradeTab className="my-6 max-sm:mb-0" />
          </div>

          {/* Right */}
          {!isMobile && (
            <div className="w-aside">
              <TradeTab />
              {/* <HoldersRank className="mt-4" /> */}
            </div>
          )}
        </div>
      </main>
    </TokenProvider>
  )
}

export default TokenPage
