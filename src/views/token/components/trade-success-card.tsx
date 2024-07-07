import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { IoMdClose } from 'react-icons/io'
import { gsap } from 'gsap'
import { useAccount } from 'wagmi'
import { isEmpty } from 'lodash'

import { utilLang } from '@/utils/lang'
import { useHeaderStore } from '@/stores/use-header-store'
import { fmt } from '@/utils/fmt'
import { useUserStore } from '@/stores/use-user-store'
import { userApi } from '@/api/user'

interface Props {
  amount: string
  symbol?: string
  diamond?: string
  onClose?: () => void
}

export const TradeSuccessCard = (props: Props) => {
  const { amount, symbol = '', diamond = '', onClose } = props
  const { t } = useTranslation()

  const isZero = BigNumber(diamond).lte(0) || isEmpty(diamond)

  return (
    <>
      <IoMdClose
        className="absolute right-2 top-2 cursor-pointer"
        size={20}
        onClick={onClose}
      />
      <div>
        <h2 className="relative font-bold text-lg flex items-center mt-2">
          <img
            src={`/images/reward/diamond-star.png`}
            alt="diamond"
            className={'w-6 h-6'}
          />
          {t('trade.success')}
        </h2>

        <p className="text-base my-1 max-sm:ml-3">
          {utilLang.replace(t('trade.success.reward'), [
            fmt.decimals(amount),
            symbol,
          ])}
        </p>
        {!isZero && (
          <p className="text-base max-sm:ml-3">
            {t('trade.success.diamond').split('$')[0]}
            <span className="text-xl text-blue-600">
              {BigNumber(diamond).toFormat()}
            </span>
            {t('trade.success.diamond').split('$')[1]}
          </p>
        )}
      </div>
    </>
  )
}

export default TradeSuccessCard
