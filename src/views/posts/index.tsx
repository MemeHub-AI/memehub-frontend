import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { cn } from '@/lib/utils'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useRouter } from 'next/router'
import { MyPosts } from './components/my-posts'
import { OrtherPosts } from './components/orther-posts'
import Header from './components/header'
import { Posts } from './type'
// enum Tab {
//   Latest = 'latest',
//   Hot = 'hot',
//   MyIdea = 'my idea',
//   MyParticipate = 'my participate'
// }
const PostPage = () => {
  const [posts, setPosts] = useState<Posts | undefined>({
    type: 1,
    data: [
      {
        isLaunched: true,
        isAirdrop: true,
      },
      {
        isLaunched: true,
        isAirdrop: false,
      },
      {
        isLaunched: false,
        isAirdrop: false,
      },
    ],
  })
  console.log(posts)

  const renderCom = () => {
    switch (posts?.type) {
      case 0:
        return <MyPosts postObj={posts} />
      case 1:
        return <OrtherPosts postObj={posts} />
    }
  }
  return (
    <div>
      <PrimaryLayout container="div" className={cn('w-full')}>
        <Header setPosts={setPosts} />
        {/* <OfflinePost/> */}
        {renderCom()}
        {/* <MyUnlaunchedPost />
          <MyLaunchedPost /> */}
      </PrimaryLayout>
    </div>
  )
}

export default PostPage
