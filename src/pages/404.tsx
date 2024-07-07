import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'

export const NotFound = () => {
  const { t } = useTranslation()
  const { push } = useRouter()

  return (
    <div className="flex flex-col justify-center items-center h-body">
      <img src="/images/404.png" alt="404" className="max-w-128 select-none" />
      <h1 className="text-2xl font-bold">{t('404.desc1')}</h1>
      <h2 className="my-2">{t('404.desc2')}</h2>
      <div className="flex items-center">
        <Button onClick={() => push(Routes.Main)}>{t('goto.home')}</Button>
        <Button
          className="bg-lime-green ml-3"
          onClick={() => push(Routes.Create)}
        >
          {t('token.create')}
        </Button>
      </div>
    </div>
  )
}

export default NotFound
