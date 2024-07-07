import React from 'react'
import { useTranslation } from 'react-i18next'

import NotFound from '@/components/not-found'

export const TokenQueryInvalid = ({ reason }: { reason: string }) => {
  const { t } = useTranslation()

  return (
    <NotFound
      src="/images/empty.png"
      imgClass="max-w-64"
      title={t('token.invalid.token').replace('{}', reason)}
    />
  )
}

export default TokenQueryInvalid
