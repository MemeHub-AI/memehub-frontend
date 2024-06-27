import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { PrimaryLayout } from '@/components/layouts/primary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Kol } from './kol'
import { Communities } from './communities'
import { useRouter } from 'next/router'

enum Tab {
  Kol = 'kol',
  Communities = 'communities',
}

export const AlliancePage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { tab } = router.query
  const defaultValue = (tab || Tab.Kol) as string
  const tabMap = {
    [Tab.Kol]: t('alliance.kol'),
    [Tab.Communities]: t('alliance.communities'),
  }

  const handleTabChange = (value: string) => {
    router.replace(`${router.pathname}?tab=${value}`)
  }

  return (
    <PrimaryLayout container="div" className="py-5">
      <Tabs value={defaultValue} onValueChange={handleTabChange}>
        <TabsList className="border-none gap-2 h-10">
          <TabsTrigger
            value={Tab.Kol}
            className="text-lg rounded-lg border-2 border-transparent hover:bg-transparent hover:border-2 hover:border-black"
          >
            {tabMap[Tab.Kol]}
          </TabsTrigger>
          <TabsTrigger
            value={Tab.Communities}
            className="text-lg rounded-lg border-2 border-transparent hover:bg-transparent hover:border-2 hover:border-black"
          >
            {tabMap[Tab.Communities]}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.Kol}>
          <Kol />
        </TabsContent>
        <TabsContent value={Tab.Communities}>
          <Communities />
        </TabsContent>
      </Tabs>
    </PrimaryLayout>
  )
}

export default AlliancePage
