import { type ComponentProps, memo, useEffect, useState } from 'react'
import { RiArrowLeftWideLine, RiArrowRightWideLine } from 'react-icons/ri'

import { useResponsive } from '@/hooks/use-responsive'
import { cn } from '@/lib/utils'
import { NewsAside } from './news-aside'

export const CollapseAside = memo((props: ComponentProps<'div'>) => {
  const { className } = props
  const [isCollapse, setIsCollapse] = useState(false)
  const { isLaptop } = useResponsive()

  useEffect(() => {
    if (isLaptop) {
      return setIsCollapse(true)
    }

    return () => setIsCollapse(false)
  }, [isLaptop])

  return (
    <div
      className={cn(
        'relative border-l border-zinc-200 max-lg:hidden',
        className
      )}
    >
      <div
        onClick={() => setIsCollapse(!isCollapse)}
        className={cn(
          'absolute top-1/2 -left-5 cursor-pointer bg-zinc-100 z-50 rounded-full p-2 w-10 h-10',
          'shadow-md shadow-zinc-400 hover:bg-zinc-200 transition-all duration-300'
        )}
      >
        {!isCollapse ? (
          <RiArrowRightWideLine size={25} />
        ) : (
          <RiArrowLeftWideLine size={25} />
        )}
      </div>

      <div className={cn(isCollapse && 'hidden')}>
        <NewsAside />
      </div>
    </div>
  )
})

export default CollapseAside
