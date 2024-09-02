import { type ReactNode } from 'react'
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
      value={pathname}
      onValueChange={(v) => router.push(v)}
      className={cn('flex-1 sm:max-w-2xl')}
    >
      <TabsList
        className={cn(
          'border-zinc-200 border-t-0 border-r-0 border-l-0 border-b-[1px] lg:border-none justify-start overflow-visible',
          'rounded-none h-10 max-sm:w-full md:flex md:justify-between md:h-14',
          'lg:relative lg:after:absolute lg:after:-left-96 lg:after:-right-96 lg:after:border-b lg:after:border-zinc-200 lg:after:bottom-0',
          'max-lg:sticky max-lg:top-0 max-lg:z-50 max-lg:bg-white'
        )}
      >
        {tabs.map(({ id, route, title }) => (
          <TabsTrigger
            key={id}
            value={route}
            className={cn(
              '!text-zinc-500 font-normal px-2 first:ml-3 duration-0 !bg-transparent',
              'group !mx-0 py-0 duration-150 flex-1 sm:text-base sm:hover:!bg-zinc-100'
            )}
          >
            <span
              className={cn(
                'h-full flex justify-center items-center relative',
                'group-data-[state=active]:before:content-[""] group-data-[state=active]:before:w-full group-data-[state=active]:before:h-1',
                'group-data-[state=active]:before:absolute group-data-[state=active]:before:bottom-0 group-data-[state=active]:before:rounded-full',
                'group-data-[state=active]:font-bold group-data-[state=active]:!text-black group-data-[state=active]:before:bg-blue-500'
              )}
            >
              {title}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div
        className="lg:h-[calc(100vh-64px)] overflow-auto max-sm:max-w-sm"
        id={memexBodyId}
      >
        {children}
      </div>

      {isPad && <IdeaFloatButton />}
    </Tabs>
  )
}

export default MemexTabs
