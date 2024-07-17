import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { cn } from '@/lib/utils'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useRouter } from 'next/router'
import {MyPosts} from './components/my-posts'
import { OrtherPosts } from './components/orther-posts';
import Header from './components/header'
// enum Tab {
//   Latest = 'latest',
//   Hot = 'hot',
//   MyIdea = 'my idea',
//   MyParticipate = 'my participate'
// }
const PostPage = () => {
  const [posts , setPosts] = useState<any[]>([])
  console.log(posts);
  
  useEffect(()=>{
    // setPosts([])
  })
  // const router = useRouter()
  // const {tab} = router.query
  // const tabs = {
  //   latest :t('latest'), 
  //   hot :t('hot'), 
  //   myIdea :t('idea') , 
  //   myParyicipate :t('participate')
  // }
  return (
    <div>
       <PrimaryLayout container="div" className={cn('w-full')}>
          <Header setPosts = {setPosts}/>
          {/* <OfflinePost/> */}
          <OrtherPosts posts={posts}/>
          <MyPosts posts={posts}/>
          {/* <MyUnlaunchedPost />
          <MyLaunchedPost /> */}
       </PrimaryLayout>
    </div>
  )
}

export default PostPage