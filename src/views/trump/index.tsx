import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const totalAmount = 9

export const TrumpPage = () => {
  const { t } = useTranslation()

  return (
    <main className="flex flex-col items-center text-center px-3 space-y-3 mt-20 sm:max-w-md sm:mx-auto">
      <h1 className="font-bold text-xl">{t('trump.reward-pool')}</h1>
      <p className="">{totalAmount} BNB</p>
      <p className="">
        {t('trump.collection')} = {totalAmount / 2} BNB
      </p>
      <p className="font-bold">{t('trump.detect')}</p>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src="/images/trump.jpeg"
            alt="nft"
            className="rounded h-26"
          />
        ))}
      </div>
      <Button className="bg-blue-600 text-white px-6">
        {t('trump.redeem')}
      </Button>
      <div>
        <p>{t('trump.redeemed1').replace('{}', '4.5 BNB')}</p>
        <p>
          {t('trump.redeemed2').replace('{}', '50 Trump').replace('{}', 'BNB')}
        </p>
      </div>
    </main>
  )
}

export default TrumpPage
