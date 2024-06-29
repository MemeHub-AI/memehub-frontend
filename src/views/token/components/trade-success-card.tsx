import React, { forwardRef, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { IoMdClose } from 'react-icons/io'
import { gsap } from 'gsap'

import { utilLang } from '@/utils/lang'
import { useHeaderStore } from '@/stores/use-header-store'
import { fmt } from '@/utils/fmt'
import { useUserStore } from '@/stores/use-user-store'
import { userApi } from '@/api/user'
import { useAccount } from 'wagmi'

interface Props {
  amount: string
  symbol?: string
  diamond?: string
  onClose?: () => void
}

export const TradeSuccessCard = (props: Props) => {
  const { amount, symbol = '', diamond = '', onClose } = props
  const { t } = useTranslation()
  const isZero = BigNumber(amount).lte(0)
  const { setUserInfo } = useUserStore()
  const { address } = useAccount()

  const onEnd = async () => {
    try {
      const { data } = await userApi.getInfo(address!)
      setUserInfo(data)
    } catch {}
  }

  return (
    <>
      <IoMdClose
        className="absolute right-2 top-2 cursor-pointer"
        size={20}
        onClick={onClose}
      />
      <div>
        <h2 className="relative font-bold text-lg flex items-center gap-2 mt-2">
          <img
            src={`/images/reward/diamond-star.png`}
            alt="diamond"
            className={'w-6 h-6'}
          />
          <DiamondIcon isZero={isZero} onEnd={onEnd} />
          <DiamondIcon isZero={isZero} delay={0.05} />
          <DiamondIcon isZero={isZero} delay={0.1} />
          <DiamondIcon isZero={isZero} delay={0.15} />
          <DiamondIcon isZero={isZero} delay={0.2} />
          {t('trade.success')}
        </h2>

        <p className="text-base my-1">
          {utilLang.replace(t('trade.success.reward'), [
            fmt.decimals(amount),
            symbol,
          ])}
        </p>
        {!isZero && (
          <p className="text-base">
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

interface DiamondIconProps {
  isZero: boolean
  delay?: number
  onEnd?: () => void
}

const DiamondIcon = ({ isZero, delay = 0, onEnd }: DiamondIconProps) => {
  const diamondRef = useRef<HTMLImageElement>(null)
  const { diamondEl: rewardDiamondEl } = useHeaderStore()

  const motion = () => {
    if (!diamondRef.current || !rewardDiamondEl || isZero) {
      return
    }
    const startRect = diamondRef.current.getBoundingClientRect()
    const endRect = rewardDiamondEl.getBoundingClientRect()

    // console.log('startRect', startRect.x, startRect.y, startRect)
    // console.log('endRect', endRect.x, endRect.y, endRect)
    console.log(startRect, endRect)

    const deltaX = endRect.left - startRect.left
    const deltaY = innerHeight - startRect.top + endRect.top - innerHeight

    const tween = gsap.to(diamondRef.current, {
      x: deltaX,
      y: deltaY,
      width: 20,
      height: 20,
      duration: 2,
      delay,
    })
    tween.eventCallback('onComplete', () => {
      onEnd?.()
      setTimeout(() => {
        diamondRef.current?.remove()
      }, 300)
    })
    return tween
  }

  useEffect(() => {
    setTimeout(() => motion(), 350)
  }, [rewardDiamondEl])

  return (
    <img
      ref={diamondRef}
      src={`/images/reward/diamond.png`}
      alt="diamond"
      className={'w-6 h-6 absolute'}
    />
  )
}

export default TradeSuccessCard
