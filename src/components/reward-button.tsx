import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from './ui/button'
import { Routes } from '@/routes'

export const RewardButton = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className="bg-lime-300 text-blue-deep font-bold gap-2"
      onClick={() => router.push(Routes.Reward)}
    >
      {/* <div>🧑‍🚀 {t('referral')}</div> */}
      <div>💎 {t('diamond')}</div>
    </Button>
  )
}

export default RewardButton
