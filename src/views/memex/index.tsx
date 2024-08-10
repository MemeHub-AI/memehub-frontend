import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PrimaryLayout } from '@/components/layouts/primary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import { MyPosts } from './components/my-posts'
import { OrtherPosts } from './components/orther-posts'

enum Tab {
  Latest = '0',
  Hot = '1',
  MyParticipate = '2',
  MyIdea = '3',
  Successed = '4',
}

export const MemexPage = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(Tab.Latest)
  const { pathname, ...router } = useRouter()
  const tabs = [
    {
      value: Tab.Latest,
      title: t('latest'),
      comp: <MyPosts />,
    },
    {
      value: Tab.Hot,
      title: t('hots'),
      comp: <OrtherPosts />,
    },
    {
      value: Tab.MyParticipate,
      title: t('memex.myparticipate'),
    },
    {
      value: Tab.MyIdea,
      title: t('memex.my-idea'),
    },
    {
      value: Tab.Successed,
      title: t('successed'),
    },
  ]

  return (
    <PrimaryLayout mainClass="!px-0">
      <Tabs
        value={tab}
        onValueChange={(t) => {
          setTab(t as Tab)
          router.push({ pathname, query: { t } })
        }}
      >
        <TabsList
          className={cn(
            'border-t-0 border-l-0 border-r-0 !border-b border-zinc-200',
            'w-screen max-w-screen justify-start rounded-none h-10'
          )}
        >
          {tabs.map(({ value, title }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="!text-black font-normal data-[state=active]:!bg-transparent data-[state=active]:font-bold px-0 first:ml-3 mx-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 duration-0"
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, comp }) => (
          <TabsContent value={value} className="px-3">
            {comp}
          </TabsContent>
        ))}
      </Tabs>
    </PrimaryLayout>
  )
}

export default MemexPage
