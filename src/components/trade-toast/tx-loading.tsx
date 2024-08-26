import { useTranslation } from 'react-i18next'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Link from 'next/link'

import { Container } from './container'
import { type TxStatusProps } from './tx-status'

export const TxLoading = ({ txUrl, getToastId }: TxStatusProps) => {
  const { t } = useTranslation()

  return (
    <Container
      className="flex flex-col justify-between"
      getToastId={getToastId}
    >
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
