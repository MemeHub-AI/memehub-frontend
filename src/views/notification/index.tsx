import { type ReactNode } from 'react'

import { PrimaryLayout } from '@/components/layouts/primary'

export const NotificationPage = () => {
  return (
    <div className="w-full">
      <h1 className="text-center text-xl font-bold">Coming Soon</h1>
    </div>
  )
}

NotificationPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout>{page}</PrimaryLayout>
)

export default NotificationPage
