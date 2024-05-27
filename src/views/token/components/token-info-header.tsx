import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'
import { Progress } from '@/components/ui/progress'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'

export const TokenInfoHeader = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { currentToken, totalToken, tokenInfo } = useTokenContext()
  const percent = BigNumber(currentToken)
    .div(totalToken)
    .multipliedBy(100)
    .toFixed(3)
  const marketMax = BigNumber(totalToken).toFixed(3)
  const symbol = 'ETH'

  const toUser = () => {
    router.push(`${Routes.Account}/${tokenInfo?.creator.wallet_address}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={router.back}>{t('back')}</Button>

      <div className="flex items-center gap-2">
        <img
          src={tokenInfo?.creator.logo}
          alt="avatar"
          className="rounded w-9 h-9 cursor-pointer"
          onClick={toUser}
        />
        <div className="flex flex-col">
          <span className="hover:underline cursor-pointer" onClick={toUser}>
            {tokenInfo?.creator.name}
          </span>
          <span className="text-sm text-zinc-500">
            {fmt.addr(tokenInfo?.creator.wallet_address)}
          </span>
        </div>
      </div>

      {/* Bonding curve progress */}
      <div className="my-3 flex-1 ml-10">
        <Progress
          className="h-5"
          indicatorClass="bg-blue-600"
          labelClass="text-white"
          value={Number(percent)}
          label={Number.isNaN(Number(percent)) ? '0' : percent}
        />
        <div className="text-zinc-400 text-xs mt-1 text-end">
          {t('bonding-curve.token').replace('{}', `${marketMax} ${symbol}`)}
        </div>
      </div>
    </div>
  )
}

export default TokenInfoHeader
