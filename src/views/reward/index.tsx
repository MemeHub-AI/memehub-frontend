import React from 'react'

import { PrimaryLayout } from '@/components/layouts/primary'
import { RewardPointsPage } from './components/points-page'
import { RewardFullPage } from './components/full-page'

export const RewardPage = () => {
  return (
    <PrimaryLayout container="div" className="mt-4 space-y-3">
      <RewardPointsPage />
      {/* <RewardFullPage /> */}
    </PrimaryLayout>
  )
}

export default RewardPage
