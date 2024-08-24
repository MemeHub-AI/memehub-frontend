import React, { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Kol } from './kol'
import { Communities } from './communities'
import { useIsPlayAudio } from '@/stores/use-is-play-audio'
import { useAudioPlayer } from '@/hooks/use-audio-player'

enum Tab {
  Kol = 'kol',
  Communities = 'communities',
}

// TODO/low: router params
export const AlliancePage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { tab } = router.query
  const defaultValue = (tab || Tab.Kol) as string
  const tabMap = {
    [Tab.Kol]: t('alliance.kol'),
    [Tab.Communities]: t('alliance.communities'),
  }
  const { isPlayAllianceAudio, setIsPlayAllianceAudio } = useIsPlayAudio()
  const { playAlliance } = useAudioPlayer()

  const handleTabChange = (value: string) => {
    router.replace(`${router.pathname}?tab=${value}`)
  }

  useEffect(() => {
    if (isPlayAllianceAudio) {
      playAlliance()
      setIsPlayAllianceAudio(false)
    }
  }, [])

  return (
    <Tabs value={defaultValue} onValueChange={handleTabChange}>
      <TabsList className="border-none space-x-2 h-10">
        <TabsTrigger
          value={Tab.Kol}
          className="text-lg rounded-lg border-2 border-transparent hover:bg-transparent hover:border-2 hover:border-black bg-white"
        >
          {tabMap[Tab.Kol]}
        </TabsTrigger>
        <TabsTrigger
          value={Tab.Communities}
          className="text-lg rounded-lg border-2 border-transparent hover:bg-transparent hover:border-2 hover:border-black bg-white"
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
  )
}

AlliancePage.getLayout = (page: ReactNode) => (
  <PrimaryLayout>{page}</PrimaryLayout>
)

export default AlliancePage
