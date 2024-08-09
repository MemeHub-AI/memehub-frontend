import { useTranslation } from 'react-i18next'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Link from 'next/link'

import { Container } from './container'
import { useTradeToastContext } from '@/contexts/trade-toast'

export const TxLoading = () => {
  const { t } = useTranslation()
  const { txUrl } = useTradeToastContext()

  return (
    <Container className="flex flex-col justify-between">
      <div className="flex items-center mb-4">
        <div className="font-bold mr-2">{t('tx.submit')}</div>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
      <Link
        href={txUrl}
        target="_blank"
        className="text-blue-600 cursor-pointer hover:underline"
      >
        {t('tx')}
      </Link>
    </Container>
  )
}
