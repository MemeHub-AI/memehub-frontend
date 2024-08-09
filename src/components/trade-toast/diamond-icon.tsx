import { useHeaderStore } from '@/stores/use-header-store'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

interface DiamondIconProps {
  isZero: boolean
  delay?: number
  onEnd?: () => void
}

export const DiamondIcon = ({ isZero, delay = 0, onEnd }: DiamondIconProps) => {
  const diamondRef = useRef<HTMLImageElement>(null)
  const { diamondEl: rewardDiamondEl } = useHeaderStore()

  const motion = () => {
    if (!diamondRef.current || !rewardDiamondEl || isZero) {
      return
    }
    const startRect = diamondRef.current.getBoundingClientRect()
    const endRect = rewardDiamondEl.getBoundingClientRect()

    const deltaX = endRect.left - startRect.left
    const deltaY = innerHeight - startRect.top + endRect.top - innerHeight

    const tween = gsap.to(diamondRef.current, {
      x: deltaX,
      y: deltaY,
      width: 20,
      height: 20,
      duration: 2,
      opacity: 1,
      delay,
    })
    tween.eventCallback('onComplete', () => {
      onEnd?.()
      setTimeout(() => {
        diamondRef.current?.remove()
      }, 350)
    })
    return tween
  }

  useEffect(() => {
    setTimeout(() => motion(), 450)
  }, [rewardDiamondEl])

  return (
    <img
      ref={diamondRef}
      src={`/images/reward/diamond.png`}
      alt="diamond"
      className={'w-[20px] h-[20px] absolute top-0 right-0 opacity-10'}
    />
  )
}
