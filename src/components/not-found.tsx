import React, { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'

interface Props extends Omit<ComponentProps<'div'>, 'title'> {
  src?: string
  title?: ReactNode
  desc?: ReactNode
  showButton?: boolean
  imgClass?: string
}

export const NotFound = (props: Props) => {
  const { t } = useTranslation()
  const {
    title = t('404.desc1'),
    desc = t('404.desc2'),
    src = '/images/404.png',
    showButton = true,
    children,
    className,
    imgClass,
  } = props
  const { push } = useRouter()

  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center h-body',
        className
      )}
    >
      {!isEmpty(src) && (
        <img
          src={src}
          alt="404"
          className={cn('max-w-128 select-none', imgClass)}
        />
      )}
      {!isEmpty(title) && <h1 className="text-2xl font-bold mt-3">{title}</h1>}
      {!isEmpty(desc) && <h2 className="my-2">{desc}</h2>}
      {showButton && (
        <div className="flex items-center">
          <Button onClick={() => push(Routes.Main)}>{t('goto.home')}</Button>
          <Button
            className="bg-lime-green ml-3"
            onClick={() => push(Routes.Create)}
          >
            {t('token.create')}
          </Button>
        </div>
      )}
      {children}
    </div>
  )
}

export default NotFound
