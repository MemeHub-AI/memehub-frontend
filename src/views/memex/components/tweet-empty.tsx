import React from 'react'
import { useTranslation } from 'react-i18next'

export const TweetEmpty = () => {
  const { t } = useTranslation()

  // TODO: Enrich it
  return <div className="text-center text-zinc-500 mt-10">{t('no-yet')}</div>
}

export default TweetEmpty
