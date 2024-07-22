import React from 'react'
import { PinTopIcon } from '@radix-ui/react-icons'
import { useWindowScroll } from 'react-use'

import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const PERCENT = 0.3

export const BackToTop = () => {
  const { y } = useWindowScroll()
  const isShow = y / window.innerHeight > PERCENT

  return (
    <Button
      size="icon"
      className={cn(
        'fixed right-14 bottom-14 z-50 max-sm:right-4 transition-all bg-white max-sm:bottom-[10vh] max-sm:w-[10vw] max-sm:h-[10vw]',
        isShow ? 'scale-100' : 'scale-0',
      )}
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <PinTopIcon />
    </Button>
  )
}

export default BackToTop
