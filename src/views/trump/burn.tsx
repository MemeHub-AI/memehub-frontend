import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const TrumpBurnPage = () => {
  const { t } = useTranslation()

  return (
    <main className="flex flex-col items-center space-y-3 px-3 mt-20 sm:max-w-sm sm:mx-auto">
      <h1 className="text-xl font-bold">{t('trump.burn-pool')}</h1>
      <Input placeholder={t('trump.burn.placehoder')} />
      <Button className="w-full">{t('trump.my-amount')}</Button>
    </main>
  )
}

export default TrumpBurnPage
