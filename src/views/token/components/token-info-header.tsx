import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useTokenContext } from '@/contexts/token'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'

export const TokenInfoHeader = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()

  return (
    <>
      <div className="flex items-center gap-4">
        <Button onClick={router.back}>{t('back')}</Button>

        <div
          className="flex items-center gap-2"
          onClick={() => {
            router.push(
              `${Routes.Account}/${tokenInfo?.creator.wallet_address}`
            )
          }}
        >
          <img
            src={tokenInfo?.creator.logo}
            alt="avatar"
            className="rounded w-9 h-9 cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="hover:underline cursor-pointer">
              {tokenInfo?.creator.name}
            </span>
            <span className="text-sm text-zinc-500">
              {fmt.addr(tokenInfo?.creator.wallet_address)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default TokenInfoHeader
