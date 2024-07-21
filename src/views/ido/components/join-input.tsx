import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIdo } from '../hooks/use-ido'
import { useIdoContext } from '@/contexts/ido'
import { cn } from '@/lib/utils'
import { useAccount, useBalance } from 'wagmi'
import { BI_ZERO } from '@/constants/number'
import { formatEther } from 'viem'
import { fmt } from '@/utils/fmt'
import { CONTRACT_ERR } from '@/errors/contract'

export const JoinInput = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { refetchIdoInfo } = useIdoContext()
  const { isLoading, buy } = useIdo(refetchIdoInfo)
  const { reserveSymbol, chainId, userRemain } = useIdoContext()
  const { address } = useAccount()
  const { data: reserveBalance } = useBalance({ address, chainId })
  const balance = formatEther(reserveBalance?.value ?? BI_ZERO)

  const onChange = (value: string) => {
    const v = BigNumber(value)
    if (v.lt(0)) return
    if (v.gt(userRemain)) {
      setValue(userRemain)
      return
    }

    setValue(value)
  }

  const onSubmit = () => {
    const v = BigNumber(value)
    if (v.isNaN()) return
    if (BigNumber(balance).lt(value)) {
      return CONTRACT_ERR.balanceInsufficient()
    }

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
          className="max-w-44 h-9"
          inputClass="pl-2 pr-0"
          placeholder={t('ido.input-amount')}
          endIcon={
            <span
              className={cn(
                'text-blue-600 text-sm mr-1 whitespace-nowrap',
                isLoading && 'opacity-50',
              )}
              onClick={() => {
                if (isLoading) return
                if (BigNumber(balance).lt(userRemain)) {
                  return setValue(balance)
                }
                setValue(userRemain)
              }}
            >
              {t('max')}({BigNumber(userRemain).toFixed(2)})
            </span>
          }
          value={value}
          onChange={({ target }) => onChange(target.value)}
          disabled={isLoading}
        />
        <div className="flex items-center space-x-1">
          <img src="/images/bsc.svg" alt="logo" className="w-5" />
          <span>{reserveSymbol}</span>
        </div>
      </div>
      <p className="text-xs mt-1 text-zinc-500">
        {t('balance')}: {fmt.decimals(balance)} {reserveSymbol}
      </p>
      <Button
        className="mt-3 w-min bg-yellow-200"
        size="lg"
        shadow="none"
        disabled={isLoading}
      >
        {t('ido.join')}
      </Button>
    </form>
  )
}

export default JoinInput
