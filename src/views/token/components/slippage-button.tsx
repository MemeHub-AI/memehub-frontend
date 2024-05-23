import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTradeContext } from '@/contexts/trade'

export const SlippageButton = () => {
  const { t } = useTranslation()
  const [slippage, setSlippage] = useState('5')
  const {} = useTradeContext()

  const onConfirm = () => {
    if (isEmpty(slippage) || BigNumber(slippage).lt(0)) {
      setSlippage('5')
    }
  }

  return (
    <div className="flex justify-between w-full gap-2">
      <AlertDialog
        title={<p>{t('slippage.title')}</p>}
        description={
          <div>
            <p className="mb-3">{t('slippage.description')}</p>
            <div className="flex items-center gap-2">
              <Input
                value={slippage}
                type="number"
                className="text-black"
                onChange={({ target }) => {
                  if (target.value.length > 3) return
                  setSlippage(target.value)
                }}
              />
              <span>%</span>
            </div>
          </div>
        }
        onConfirm={onConfirm}
      >
        <Button size="xs">
          {t('set-max-slippage')}({slippage}%)
        </Button>
      </AlertDialog>
    </div>
  )
}

export default SlippageButton
