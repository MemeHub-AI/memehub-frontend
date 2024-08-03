import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { Container } from './container'
import { useTradeToastContext } from '@/contexts/trade-toast'

export const SlippageError = () => {
  const { t } = useTranslation()
  const { txUrl } = useTradeToastContext()

  return (
    <Container>
      <div className="font-bold">{t('tx.fail')}</div>
      <div className="flex justify-between">
        <div>
          <div className="my-2">{t('slippage.low.tips')}</div>
          <Link
            href={txUrl}
            target="_blank"
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {t('tx')}
          </Link>
        </div>
        <img
          src="/images/error.png"
          alt="Error"
          className="w-[60px] h-[60px]"
        />
      </div>
    </Container>
  )
}
