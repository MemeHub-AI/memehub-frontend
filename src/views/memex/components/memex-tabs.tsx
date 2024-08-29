import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { useUserStore } from '@/stores/use-user-store'
import { IdeaFloatButton } from './idea-float-button'
import { useResponsive } from '@/hooks/use-responsive'

export const memexBodyId = 'memex-body'

export const MemexTabs = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const { pathname, ...router } = useRouter()
  const { userInfo } = useUserStore()
  const { isPad } = useResponsive()

  const userTabs = [
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
  ]
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
    ...(userInfo ? userTabs : []),
    {
      id: 5,
      title: t('successed'),
      route: Routes.MemexSuccessed,
    },
  ]

  return (
    <Tabs
      onValueChange={(v) => router.push(v)}
      className="flex-1 md:max-w-xl max-xl:relative max-xl:before:absolute max-xl:before:-top-4 max-xl:before:border-l max-xl:before:border-zinc-200 max-xl:before:left-0"
    >
      <TabsList
        className={cn(
          'border-zinc-200 border-t-0 border-r-0 border-l-0 border-b-[1px] justify-start overflow-visible',
          'rounded-none h-10 max-sm:w-full md:flex md:justify-between md:h-14 md:px-4'
        )}
      >
        {tabs.map(({ id, route, title }) => (
          <TabsTrigger
            key={id}
            value={route}
            className={cn(
              '!text-zinc-500 font-normal px-0 first:ml-3 mx-2 duration-0 !bg-transparent md:text-lg] relative',
              'data-[state=active]:before:content-[""] data-[state=active]:before:w-full data-[state=active]:before:h-1',
              'data-[state=active]:before:absolute data-[state=active]:before:bottom-0 data-[state=active]:before:rounded-full',
              'data-[state=active]:font-bold data-[state=active]:!text-black data-[state=active]:before:bg-blue-400'
            )}
          >
            {title}
          </TabsTrigger>
        ))}
      </TabsList>

      <div
        className="h-[calc(100vh-64px-2.5rem)] md:h-[calc(100vh-64px-3.5rem)] overflow-auto max-sm:max-w-sm"
        id={memexBodyId}
      >
        {children}
      </div>

      {isPad && <IdeaFloatButton />}
    </Tabs>
  )
}

export default MemexTabs
