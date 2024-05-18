import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { TradeTab } from './components/trade-tab'
import { Button } from '@/components/ui/button'
import { TokenInfo } from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import { useResponsive } from '@/hooks/use-responsive'
import { HoldersRank } from './components/holders-rank'

export const TokenPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()

  return (
    <main className="px-4 max-sm:px-3 pt-4">
      <Button className="mb-3" onClick={router.back}>
        {t('back')}
      </Button>
      <div className="flex space-x-4 max-sm:flex-col max-sm:space-x-0">
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
  )
}

export default TokenPage
