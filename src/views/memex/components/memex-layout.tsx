import React, { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { IdeaFloatButton } from './idea-float-button'
import { PrimaryLayout } from '@/components/layouts/primary'

export const MemexLayout = ({ children }: { children?: ReactNode }) => {
  const { t } = useTranslation()
  const { pathname, ...router } = useRouter()

  const tabs = [
    {
      id: 1,
      title: t('latest'),
      route: Routes.MemexLatest,
    },
    {
      id: 2,
      title: t('hots'),
      route: Routes.MemexHots,
    },
    {
      id: 3,
      title: t('memex.my-involved'),
      route: Routes.MemexMyInvolved,
    },
    {
      id: 4,
      title: t('memex.my-idea'),
      route: Routes.MemexMyIdea,
    },
    {
      id: 5,
      title: t('successed'),
      route: Routes.MemexSuccessed,
    },
  ]

  return (
    <PrimaryLayout mainClass="flex" padding={false}>
      <Tabs onValueChange={(v) => router.push(v)} className="flex-1 sticky">
        <TabsList
          className={cn(
            'border-t-0 border-l-0 border-r-0 !border-b border-zinc-200',
            'justify-start rounded-none h-10 max-sm:w-full sm:w-full sm:max-w-sm'
          )}
        >
          {tabs.map(({ id, route, title }) => (
            <TabsTrigger
              key={id}
              value={route}
              className={cn(
                '!text-black font-normal px-0 first:ml-3 mx-2 duration-0 !bg-transparent',
                pathname === route && 'border-b-2 border-purple-600 font-bold'
              )}
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="h-[calc(100vh-64px-2.5rem)] overflow-auto sm:max-w-sm">
          {children}
        </div>
      </Tabs>

      <IdeaFloatButton />
    </PrimaryLayout>
  )
}

export default MemexLayout
