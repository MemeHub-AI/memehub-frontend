import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIdo } from '../hooks/use-ido'

const MAX_VALUE = '10'

export const JoinInput = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { buy } = useIdo()

  const onChange = (value: string) => {
    const v = BigNumber(value)
    if (v.lt(0)) return
    if (v.gt(MAX_VALUE)) {
      setValue(MAX_VALUE)
      return
    }

    setValue(value)
  }

  const onSubmit = () => {
    const v = BigNumber(value)
    if (v.isNaN()) return

    buy(value)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="mt-3 flex items-center space-x-1">
        <Input
          className="max-w-40 h-9"
          inputClass="pl-2 pr-0"
          placeholder={t('ido.input-amount')}
          endIcon={
            <span
              className="text-blue-600 text-sm mr-1 whitespace-nowrap"
              onClick={() => setValue(MAX_VALUE)}
            >
              {t('max')}({MAX_VALUE})
            </span>
          }
          value={value}
          onChange={({ target }) => onChange(target.value)}
        />
        <div className="flex items-center space-x-1">
          <img src="/images/bsc.svg" alt="bnb" className="w-5" />
          <span>BNB</span>
        </div>
      </div>
      <Button className="mt-3 w-min bg-yellow-200" size="lg" shadow="none">
        {t('ido.join')}
      </Button>
    </form>
  )
}

export default JoinInput
