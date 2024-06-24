import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { gsap } from 'gsap'

import { utilLang } from '@/utils/lang'
import { DiamondIcon } from '@/components/diamond-icon'
import { useHeaderStore } from '@/stores/use-header-store'

interface Props {
  amount: string
  symbol?: string
  diamond?: string
  onClose?: () => void
}

export const TradeSuccessCard = (props: Props) => {
  const { amount, symbol = '', diamond = '', onClose } = props
  const { t } = useTranslation()
  const diamondRef = useRef<HTMLImageElement>(null)
  const { rewardButtonEl } = useHeaderStore()
  const isZero = BigNumber(amount).lte(0)

  useEffect(() => {
    if (!diamondRef.current || !rewardButtonEl || isZero) {
      return
    }

    const startRect = diamondRef.current.getBoundingClientRect()
    const endRect = rewardButtonEl.getBoundingClientRect()

    // console.log('startRect', startRect.x, startRect.y, startRect)
    // console.log('endRect', endRect.x, endRect.y, endRect)

    const deltaX = endRect.left - startRect.left
    const deltaY = endRect.top - startRect.top + 130
    const tween = gsap.to(diamondRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 2,
    })

    return () => {
      tween.kill()
    }
  }, [rewardButtonEl])

  return (
    <>
      <X
        className="absolute right-2 top-2 cursor-pointer"
        size={20}
        onClick={onClose}
      />
      <div>
        <h2 className="font-bold text-lg flex items-center gap-2 mt-2">
          <DiamondIcon type="diamond-star" ref={diamondRef} />
          {t('trade.success')}
        </h2>

        <p className="text-base my-1">
          {utilLang.replace(t('trade.success.reward'), [
            BigNumber(amount || 0).toFormat(),
            symbol,
          ])}
        </p>
        {!isZero && (
          <p className="text-base">
            {t('trade.success.diamond').split('$')[0]}
            <span className="text-xl text-blue-600">{diamond}</span>
            {t('trade.success.diamond').split('$')[1]}
          </p>
        )}
      </div>
    </>
  )
}

export default TradeSuccessCard
