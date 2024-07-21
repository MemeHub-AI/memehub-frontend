import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useIdoContext } from '@/contexts/ido'

export const EndedButtons = () => {
  const { t } = useTranslation()
  const { userAmount } = useIdoContext()

  return (
    <>
      <div className="flex items-center space-x-2 mt-3">
        <Button className="bg-yellow-200" shadow="none">
          {t('ido.claim')} 1.2 LP
        </Button>
        <Button shadow="none">
          {t('ido.refund')} {userAmount} BNB
        </Button>
      </div>
    </>
  )
}

export default EndedButtons
