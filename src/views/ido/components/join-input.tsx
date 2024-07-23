import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIdo } from '../hooks/use-ido'
import { useIdoContext } from '@/contexts/ido'
import { cn } from '@/lib/utils'
import { useAccount, useBalance } from 'wagmi'
import { BI_ZERO } from '@/constants/number'
import { formatEther, zeroAddress } from 'viem'
import { fmt } from '@/utils/fmt'
import { CONTRACT_ERR } from '@/errors/contract'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { utilLang } from '@/utils/lang'

export const JoinInput = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { refetchIdoInfo } = useIdoContext()
  const { isLoading, buy } = useIdo(refetchIdoInfo)
  const { reserveSymbol, chainId, userRemaining, userAmount, pools, poolId } =
    useIdoContext()
  const { address } = useAccount()
  const { data: reserveBalance } = useBalance({ address, chainId })
  const balance = formatEther(reserveBalance?.value ?? BI_ZERO)
  const { checkForConnect, checkForChain } = useCheckAccount()

  const isEmptyPools = useMemo(() => {
    const p = pools.filter((p) => p && p !== zeroAddress)
    return isEmpty(p)
  }, [pools])

  const isLimit = BigNumber(userRemaining).lte(0) && BigNumber(userAmount).gt(0)
  const disabeld = isLoading || isEmptyPools || isLimit

  const onChange = (value: string) => {
    const v = BigNumber(value)
    if (v.lt(0)) return
    if (v.gt(userRemaining)) {
      setValue(userRemaining)
      return
    }

    setValue(value)
  }

  const onSubmit = async () => {
    const v = BigNumber(value)
    if (v.isNaN() || v.isZero()) {
      return CONTRACT_ERR.amountInvlid()
    }
    if (BigNumber(balance).lt(value)) {
      return CONTRACT_ERR.balanceInsufficient()
    }
    if (!checkForConnect()) return
    if (!(await checkForChain(chainId))) return

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
          className="max-w-48 h-9"
          inputClass="pl-2 pr-2"
          placeholder={t('ido.input-amount')}
          endIcon={
            <span
              className={cn(
                'text-blue-600 text-sm mr-1 whitespace-nowrap select-none',
                !disabeld && 'cursor-pointer',
                disabeld && 'opacity-50'
              )}
              onClick={() => {
                if (disabeld) return
                if (BigNumber(balance).lt(userRemaining)) {
                  return setValue(balance)
                }
                setValue(userRemaining)
              }}
            >
              {t('max')}({fmt.decimals(userRemaining)})
            </span>
          }
          value={value}
          onChange={({ target }) => onChange(target.value)}
          disabled={disabeld}
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
        variant="yellow"
        className="mt-3 w-min select-none"
        size="lg"
        shadow="none"
        disabled={disabeld}
      >
        {t('ido.join')}
      </Button>
      {isLimit && (
        <p className="mt-2 text-zinc-500 text-sm">{t('ido.limit')}</p>
      )}
      {isEmptyPools && (
        <p className="mt-2 text-zinc-500 font-bold">
          {utilLang.replace(t('ido.empty-pool'), [poolId])}
        </p>
      )}
    </form>
  )
}

export default JoinInput
