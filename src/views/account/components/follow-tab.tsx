import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'
import { useResponsive } from '@/hooks/use-responsive'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export enum FollowType {
  Followers = 'followers',
  Following = 'following',
}

export const FollowTab = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  if (isMobile) return <FollowMobile />

  return (
    <Tabs defaultValue={FollowType.Followers}>
      <TabsList className="w-full">
        <TabsTrigger value={FollowType.Followers} className="w-full">
          {t('followers')}(3)
        </TabsTrigger>
        <TabsTrigger value={FollowType.Following} className="w-full">
          {t('following')}(3)
        </TabsTrigger>
      </TabsList>

      <TabsContent value={FollowType.Followers}>
        <FollowersCards />
      </TabsContent>
      <TabsContent value={FollowType.Following}>
        <FollowingCards />
      </TabsContent>
    </Tabs>
  )
}

const FollowMobile = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(FollowType.Followers)

  const isFollowers = tab === FollowType.Followers

  return (
    <Dialog>
      <div className="flex items-center justify-between">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTab(FollowType.Followers)}
          >
            {t('followers')}(3)
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTab(FollowType.Following)}
          >
            {t('following')}(3)
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>
            {isFollowers ? t('followers.my') : t('following.my')}
          </DialogTitle>
        </DialogHeader>
        {isFollowers ? <FollowersCards /> : <FollowingCards />}
      </DialogContent>
    </Dialog>
  )
}

export default FollowTab
