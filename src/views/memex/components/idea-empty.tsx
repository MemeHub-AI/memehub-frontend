import React from 'react'
import { useTranslation } from 'react-i18next'

export const IdeaEmpty = () => {
  const { t } = useTranslation()

  // TODO/memex: Enrich it
  return <div className="text-center text-zinc-500 mt-10">{t('no-yet')}</div>
}

export default IdeaEmpty
