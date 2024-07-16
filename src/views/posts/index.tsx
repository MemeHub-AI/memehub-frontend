import React from 'react'
import { t } from 'i18next'
import { cn } from '@/lib/utils'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useRouter } from 'next/router'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LatestPosts from './latest-posts'
import MyPost from './components/my-post'

// enum Tab {
//   Latest = 'latest',
//   Hot = 'hot',
//   MyIdea = 'my idea',
//   MyParticipate = 'my participate'
// }
const PostPage = () => {
  const router = useRouter()
  const {tab} = router.query
  const tabs = {
    latest :t('latest'), 
    hot :t('hot'), 
    myIdea :t('idea') , 
    myParyicipate :t('participate')
  }
  return (
    <div>
       <PrimaryLayout container="div" className={cn('w-full')}>
        {/* <MyPost/> */}
          <LatestPosts/>
       </PrimaryLayout>
    </div>
  )
}

export default PostPage